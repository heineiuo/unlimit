import Joi from 'joi'
import {ObjectId} from 'mongodb'
import queryOne from './queryOne'
import getConfig from '../../config'
import getLevel from '../../leveldb'
import ms from 'ms'

const queryLevel = (db, key) => new Promise(async resolve => {
  try {
    const result = await db.get(key);
    const validated = Joi.validate(result, Joi.object().keys({
      updateTime: Joi.number().required(),
      driveId: Joi.string().required(),
      locations: Joi.array().required()
    }))
    if (validated.error) return resolve(null)
    resolve(result)
  } catch(e){
    resolve(null)
  }
})

export const validate = query => Joi.validate(query, Joi.object().keys({
  domain: Joi.required(),
  forceSync: Joi.boolean().default(false) // 强制更新（有很短的延迟）
}), {allowUnknown: true})

export default query => (dispatch) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {domain, forceSync} = validated.value;
  const syncCache = async () => {
    try {
      const {pageDomain} = (await getConfig()).production;
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
      await db.put(domain, cacheValue)
    } catch(e){
      console.log(e)
    }
  }

  try {
    const db = (await getLevel()).sub('domain');
    const target = await queryLevel(db, domain);
    if (!target || target.disable) {
      reject(new Error('NOT_FOUND'));
      return process.nextTick(syncCache)
    }
    resolve(target);
    if (forceSync || Date.now() > target.updateTime + ms('1s')) process.nextTick(syncCache)
  } catch(e){
    reject(e)
  }
})