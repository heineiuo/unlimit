import Joi from 'joi'
import {ObjectId} from 'mongodb'
import queryOne from './queryOne'
import ms from 'ms'

const queryLevelSchema = Joi.object().keys({
  updateTime: Joi.number().required(),
  driveId: Joi.string().required(),
  locations: Joi.array().required()
})

const queryByDomainSchema = Joi.object().keys({
  domain: Joi.required(),
  forceSync: Joi.boolean().default(false) // 强制更新（有很短的延迟）
})



export default query => (dispatch) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryByDomainSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {domain, forceSync} = validated.value;
  const {getMongodb, getConfig} = getCtx()
  
  const syncCache = async () => {
    try {
      const {pageDomain} = await getConfig();
      const pageDomainRegex = new RegExp(`.${pageDomain}$`);
      const index = domain.search(pageDomainRegex);
      const filter = index === -1 ? {domain} : {
        name: domain.substring(0, index)
      }
      const driveData = await dispatch(queryOne({...filter, fields: ['locations']}));
      const cacheValue = {
        updateTime: Date.now()
      }
      if (!driveData) {
        cacheValue.disable = true;
      } else {
        cacheValue.driveId = driveData._id.toString();
        cacheValue.locations = driveData.locations;
      }

      const db = (await getLevel()).sub('domain');
      await db.findOneAndUpdate({domain}, {$set: cacheValue})
    } catch(e){
      console.log(e)
    }
  }

  try {
    const {cacheExpireTime, apiDomain} = await getConfig();
    if (domain === apiDomain) return resolve({
      driveId: '',
      locations: [{
        "pathname": "*",
        "cors": true,
        "type": "SEASHELL",
        "content": ""
      }]
    })

    const db = (await getMongodb()).collection('domain');
    
    const target = await db.findOne({domain});
    
    if (!target || target.disable) {
      reject(new Error('NOT_FOUND'));
      return process.nextTick(syncCache)
    }
    resolve(target);
    if (forceSync || Date.now() > target.updateTime + ms(cacheExpireTime)) process.nextTick(syncCache)
  } catch(e){
    reject(e)
  }
})
