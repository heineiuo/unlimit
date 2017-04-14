import path from 'path'
import filesystem from 'level-filesystem'
import Joi from 'joi'
/**
 * @api {POST} /File/cat 获取文件内容
 * @apiGroup File
 * @apiName FileCat
 * @apiParam {string} token 令牌
 * @apiParam {string} host host
 * @apiParam {string} filename 文件路径
 * @apiSuccess {string} cat 内容
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required(),
      pathname: Joi.string().required(),
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);

    const {driveId, pathname} = validated.value;
    const fs = filesystem(getCtx().leveldb.sub('fs'));
    fs.readFile(`${driveId}${pathname}`, (err, cat) => {
      if (err) {
        const lastParam = pathname.split('/').pop();
        if (lastParam.length === "" || !/\./.test(lastParam)) {
          fs.readFile(path.join(`${driveId}${pathname}`, 'index.html'), (err, cat) => {
            if (err) return reject(err);
            resolve({
              isFile: true,
              cat
            })
          });
        } else {
          reject(err);
        }

      } else {
        resolve({
          isFile: true,
          cat
        })
      }
    });

  } catch(e){
    reject(e)
  }
});
