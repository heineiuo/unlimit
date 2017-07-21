import Joi from 'joi'
import queryOne from './queryOne'
import ms from 'ms'
import CustomError from '../../CustomError'

const queryDomainSchema = Joi.object().keys({
  updateTime: Joi.number().required(),
  driveId: Joi.string().required(),
  locations: Joi.array().required()
})

const queryByDomainSchema = Joi.object().keys({
  domain: Joi.required(),
  forceSync: Joi.boolean().default(false) // 强制更新（有很短的延迟）
})



export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryByDomainSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {domain, forceSync} = validated.value;
  const {db, config, log} = getCtx()
  
  const syncCache = async () => {
    try {
      const {pageDomain} = config;
      const pageDomainRegex = new RegExp(`.${pageDomain}$`);
      const index = domain.search(pageDomainRegex);
      const filter = index === -1 ? {domain} : {
        name: domain.substring(0, index)
      }
      const driveData = await dispatch(queryOne({...filter, fields: ['locations']}));
      const cacheValue = {
        domain,
        updateTime: Date.now()
      }
      if (!driveData) {
        cacheValue.disable = true;
      } else {
        cacheValue.driveId = driveData._id;
        cacheValue.locations = driveData.locations;
      }

      const domainDb = db.collection('domain');
      await domainDb.findOneAndUpdate({domain}, {$set: cacheValue}, {upsert: true})
    } catch(e){
      // log(e)
    }
  }

  try {
    const {cacheExpireTime, apiDomain} = config;
    if (domain === apiDomain) return resolve({
      driveId: '',
      locations: [{
        "pathname": "*",
        "cors": true,
        "type": "SEASHELL",
        "content": ""
      }]
    })
    const domainDb = db.collection('domain');
    const target = await domainDb.findOne({domain});
    if (!target || target.disable) {
      reject(new CustomError('NotFoundError', 'Cannout find target domain'));
      return process.nextTick(syncCache)
    }
    resolve(target);
    if (forceSync || Date.now() > target.updateTime + ms(cacheExpireTime)) process.nextTick(syncCache)
  } catch(e){
    reject(e)
  }
})
