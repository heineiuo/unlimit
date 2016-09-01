import formidable from 'formidable'
import path from 'path'
import fs from 'fs-promise'

module.exports = async (req, res, next) => {
  try {
    const {seashellResult} = res.locals
    /**
     * 检查headers
     * 如果不是上传, 直接返回数据
     * 如果是上传, next()
     */
    if (!seashellResult.headers.__UPLOAD) return next()

    const {uploadDir, uploadLocation, uploadKey} = seashellResult.body
    console.log(uploadDir, uploadLocation, uploadKey)

    /**
     * 设置上传参数, 处理上传, 返回上传结果 {fields, files}
     * @returns {Promise}
     */
    const parsePromise = () => {
      return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm()
        form.encoding = 'utf-8'
        form.hash = 'md5'
        form.uploadDir = uploadDir
        form.keepExtensions = true
        form.multiples = true

        form.parse(req, (err, fields, files) => {
          if (err) return reject(err)
          resolve({fields, files})
        })
      })
    }

    const uploaded = await parsePromise()

    /**
     * 上传后对文件进行处理
     * 注意, uploaded.files.file 这里的`.file` 是
     * 客户端传过来的formData的key, 可以改成其他的
     */
    const getPathPromises = () => {
      const filesFile = uploaded.files[uploadKey]
      const fileList = filesFile.length > 0 ? filesFile: [filesFile]

      return fileList.map((file) => {
        return new Promise(async (resolve, reject) => {
          try {
            const fileName = `${file.hash}${path.extname(file.name).toLowerCase()}`
            await fs.rename(file.path, `${uploadDir}/${fileName}`)
            resolve(`${uploadLocation}/${fileName}`)
          } catch(e){
            reject(e)
          }
        })
      })
    }

    const result = await Promise.all(getPathPromises())

    /** example:

     [
       "https://example.com/upload/IMG_2951.PNG"
     ]

     */
    res.json(result)

  } catch(e){
    next(e)
  }
}
