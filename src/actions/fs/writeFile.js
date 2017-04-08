import path from 'path'
import Joi from 'joi'
import filesystem from 'level-filesystem'

/**
 * @api {POST} /File/writeFile 修改文件
 * @apiGroup File
 * @apiName FileVi
 * @apiParam {string} token 令牌
 * @apiParam {string} file
 * @apiParam {string} content
 */
const writeFile = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required(),
      pathname: Joi.string().required(),
      content: Joi.string().allow(''),
      noConflict: Joi.boolean()
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);

    const {driveId, pathname, content='', noConflict=false} = validated.value;
    const fs = filesystem(getCtx().leveldb.sub('fs'));
    const realPath = `${driveId}${pathname}`;

    if (noConflict) {
      await new Promise((resolve, reject) => {
        fs.readFile(realPath, err => {
          if (err) return resolve();
          reject(new Error('FILE_EXIST'))
        })
      })
    }
    fs.writeFile(realPath, content, (err) => {
      if (err) return reject(err);
      resolve({success: 1})
    })
  } catch(e){
    console.log('WRITE FILE ERROR \n'+e.stack);
    reject(e)
  }
});

export default module.exports = writeFile