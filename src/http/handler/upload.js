import formidable from "formidable"
import path from "path"
import fs from "fs-promise"

export default (req, res, seashell, options) => new Promise(async (resolve, reject) => {
  try {
    /**
     *  uploadKey: the key in formData, default is 'file'
     *  uploadDir: the real directory on server, like `/root/gateway/data/app/superuser.youkuohao.com/public/upload`,
     *  uploadLocation: the prefix for the uploaded file, like `http://superuser.youkuohao.com/upload`
     * }
     **/
    const {uploadKey, driveId, parentId, name, fileId} = options;

    /**
     * 设置上传参数, 处理上传, 返回上传结果 {fields, files}
     */
    const uploaded = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.hash = 'md5';
      form.keepExtensions = true;
      form.multiples = true;

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({fields, files})
      })
    });

    /**
     * 移动文件
     */
    const filesFile = uploaded.files[uploadKey];
    if (!filesFile) return reject(new Error('UPLOAD_FAIL'))
    const fileList = filesFile.length > 0 ? filesFile : [filesFile];
    const result = await Promise.all(fileList.map(file => new Promise(async (resolve, reject) => {
      try {
        const tmpPath = file.path;
        const content = await fs.readFile(tmpPath);
        const transferResult = await seashell.requestSelf({
          headers: {originUrl: typeof fileId ==='string' ? '/fs/mutateFileContent' : '/fs/mutateInsertOne'},
          body: {
            fileId,
            parentId,
            driveId,
            content,
            name: typeof name === 'string' ? name : `${file.hash}${path.extname(file.name).toLowerCase()}`
          }
        });

        if (transferResult.body.error) return reject(new Error(transferResult.body.error));
        await fs.unlink(tmpPath);
        resolve(transferResult.body)
      } catch (e) {
        reject(e)
      }
    })));

    /** result format:
     [
     "https://example.com/upload/IMG_2951.PNG"
     ]
     */
    res.json({result});
    resolve()
  } catch (e) {
    console.log(e)
    reject(e)
  }
});


