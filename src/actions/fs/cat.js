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
const cat = (query) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required(),
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const {hostname, pathname} = query;
    const fs = filesystem(ctx.db.fs);
    fs.readFile(`${hostname}${pathname}`, (err, cat) => {
      if (err) {
        const lastParam = pathname.split('/').pop();
        if (lastParam.length =="" || !/\./.test(lastParam)) {
          fs.readFile(path.join(`${hostname}${pathname}`, 'index.html'), (err, cat) => {
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

export default module.exports = cat;