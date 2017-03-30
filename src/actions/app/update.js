import Joi from 'joi';



const update = (query) => (ctx) => {
  return new Promise(async(resolve, reject) => {
    try {
      const validate = Joi.validate(query, Joi.object().keys({
        appName: Joi.string().required(),
        app: Joi.object().required(),
      }), {allowUnknown: true});
      if (validate.error) return reject(validate.error);
      const {appName, app} = query;
      const db = ctx.db.sub('app');
      await db.put(appName, app);
      resolve({success: 1});

    } catch(e){
      reject(e)
    }
  })

};

export default module.exports = update;