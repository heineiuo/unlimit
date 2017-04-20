import Joi from 'joi'

export const validate = query => Joi.validate(query, Joi.object().keys({
  limit: Joi.number().default(20)
}), {allowUnknown: true})


/**
 * get app list
 * @returns {Promise}
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {limit} = validated.value

  try {
    const db = getCtx().leveldb.sub('app');
    const list = [];
    db.createReadStream({limit})
      .on('data', (data) => {
        list.push(data)
      })
      .on('error', (e) => {
        console.log(e)
      })
      .on('end', () => {
        resolve({list})
      });
  } catch(e){
    reject(e)
  }
});
