import formidable from 'formidable'
import path from 'path'
import fs from 'fs-promise'

const handleUpload = (req, res, options) => new Promise(async(resolve, reject) => {

  try {

    /**
     *  uploadKey: the key in formData, default is 'file'
     *  uploadDir: the real directory on server, like `/root/gateway/data/app/superuser.youkuohao.com/public/upload`,
     *  uploadLocation: the prefix for the uploaded file, like `http://superuser.youkuohao.com/upload`
     * }
     **/
    const {uploadKey='file', uploadDir, uploadLocation} = options;

    /**
     * 设置上传参数, 处理上传, 返回上传结果 {fields, files}
     */
    const uploaded = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.hash = 'md5';
      form.uploadDir = uploadDir;
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
    const fileList = filesFile.length > 0 ? filesFile: [filesFile];
    const result = await Promise.all(fileList.map(file => new Promise(async (resolve, reject) => {
      try {
        const fileName = `${file.hash}${path.extname(file.name).toLowerCase()}`;
        await fs.rename(file.path, `${uploadDir}/${fileName}`);
        resolve(`${uploadLocation}/${fileName}`)
      } catch(e){
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
  } catch(e){
    reject(e)
  }


});


export default handleUpload