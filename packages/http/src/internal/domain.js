import ms from 'ms'
import Joi from 'joi'
import { SNIUpdate } from '../sni'
import { match, when } from 'match-when'

const defaultState = {
  
}

export default (state=defaultState, action) => match(action.type, {
  [when()]: state
})

export const approveDomainCert = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const mutateApproveDomainSchema = Joi.object().keys({
    domain: Joi.string().required(),
  })
  const validated = Joi.validate(query, mutateApproveDomainSchema, {allowUnknown: true});;
  if (validated.error) return reject(validated.error);
  const {domain} = validated.value;
  try {
    dispatch(SNIUpdate({domain}))
  } catch(e){
    reject(e)
  }
})

export const queryMeta =  query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const queryMetaSchema = Joi.object().keys({
    limit: Joi.number().default(20),
    fields: Joi.array().default(['name', 'locations'])
  })
  
  const validated = Joi.validate(query, queryMetaSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {limit, fields} = validated.value;
  const filter = {}
  const {db, request} = getState()
  const {session} = request.headers;
  if (!session) return reject('PERMISSION_DENIED')
  const userId = session.userId
  filter.users = {$elemMatch: {$eq: userId}}

  try {
    const driveDb = db.collection('drive');
    const data = await driveDb.find(filter, {fields}).limit(limit).toArray();
    resolve({data})
  } catch(e){
    reject(e)
  }
})

export const queryOneByDomain = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const queryDomainSchema = Joi.object().keys({
    updateTime: Joi.number().required(),
    driveId: Joi.string().required(),
    locations: Joi.array().required()
  })
  
  const queryByDomainSchema = Joi.object().keys({
    domain: Joi.required(),
    forceSync: Joi.boolean().default(false) // 强制更新（有很短的延迟）
  })

  const validated = Joi.validate(query, queryByDomainSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {domain, forceSync} = validated.value;
  const {db, log} = getState()
  const { PAGE_DOMAIN, CACHE_EXPIRE_TIME, API_DOMAIN } = process.env
  
  const syncCache = async () => {
    try {
      const pageDomainRegex = new RegExp(`.${PAGE_DOMAIN}$`);
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
    if (domain === API_DOMAIN) return resolve({
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
      const error = new Error('Cannout find target domain')
      error.name = 'NotFoundError'
      reject(error);
      return process.nextTick(syncCache)
    }
    resolve(target);
    if (forceSync || Date.now() > target.updateTime + ms(CACHE_EXPIRE_TIME)) process.nextTick(syncCache)
  } catch(e){
    reject(e)
  }
})


/**
 * 获取处理请求的app, 并作负载均衡
 */
export const queryOneApp = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    appName: Joi.string().regex(/[a-z]{1, 1}[0-9a-z]{4, 30}/).required(),
    appId: Joi.string().required(),
  }), {allowUnknown: true})
  const validated = validate(query);
  if (validated.error) return reject(new Error('NOT_FOUND'))
  const {appName, appId, filter} = validated.error;

  try {
    const appDb = getState().db.collection('app');
    const app = await appDb.findOne({_id: appName});
    if (app === null) return reject(new Error('NOT_FOUND'))
    const onlineItems = app.list.filter(service => service.status === 1);
    if (onlineItems.length === 0) return reject(new Error('TARGET_SERVICE_OFFLINE'));
    if (appId) return resolve(onlineItems.find(item => item.appId === appId));
    if (onlineItems.length === 1) return resolve(onlineItems[0]);
    const ts = String(Date.now());
    const randomNumber = Number(ts[ts.length - 1]);
    const randomIndex = Math.floor(randomNumber * onlineItems.length / 10);
    return resolve(app.list[randomIndex])
  } catch(e){
    reject(e);
  }
})

/**
 * get app list
 * @returns {Promise}
 */
export const queryApps = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    limit: Joi.number().default(20),
    fields: Joi.array().default(['appName', 'permissions'])
  }), {allowUnknown: true})
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {limit, fields} = validated.value
  const filter = {}
  const {session} = getState().request.headers;
  if (!session) return reject(new Error('PERMISSION_DENIED'))
  filter.adminId = session.userId;
  try {
    const {db} = getState()
    const appDb = db.collection('app');
    const data = await appDb.find(filter, {fields}).limit(limit).toArray();
    resolve({data})
  } catch(e){
    reject(e)
  }
});


export const queryOne = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const queryOneSchema = Joi.object().keys({
    domain: Joi.string().regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/),
    name: Joi.string().regex(/^[a-z]{1,1}[a-z0-9]{2,30}$/),
    driveId: Joi.string(),
    fields: Joi.array().default(['name'])
  }).xor('domain', 'driveId', 'name')
  const validated = Joi.validate(query, queryOneSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {domain, driveId, name, fields} = validated.value;
  try {
    const {db} = getState()
    const driveDb = db.collection('drive');
    const filter = driveId ? {_id: driveId} :
      name ? {name} :
      {domains: {$elemMatch: {$eq: domain}}}
    const result = await driveDb.findOne(filter, {fields})
    const error = new Error('Cannot find target drive')
    error.name = 'NotFoundError'
    if (!result) return reject(error)
    resolve({...result, driveId: result._id})
  } catch(e){
    reject(e)
  }
})



export const putDomain = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const insertSchema = Joi.object().keys({
    name: Joi.string().regex(/^[a-z]{1,1}[a-z0-9]{3,30}$/).required(),
    description: Joi.string().default(''),
  })
  const validated = Joi.validate(query, insertSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error)
  const {name, description} = validated.value;
  
  try {
    const {db} = getState()
    const {session} = getState().request.headers;
    if (!session) return reject(new Error('PERMISSION_DENIED'))
    const userId = session ? session.userId : '123';
    const driveData = await new Promise(async resolve => {
      try {
        resolve(await dispatch(queryOne({name})));
      } catch(e) {
        resolve(null)
      }
    })
    if (driveData) return reject(new Error('NAME_EXIST'));
    const driveDb = db.collection('drive');
    const result = await driveDb.insertOne({
      name,
      description,
      domains: [],
      locations: [],
      users: [userId],
      adminId: userId,
      status: 1, // 0 不启用， 1正常
    })
    resolve(result)
  } catch(e){
    reject(e)
  }
})


export const mutateLocation = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const mutateDomainSchema = Joi.object().keys({
    driveId: Joi.string().required(),
    add: Joi.array().default([]),
    remove: Joi.array().default([])
  })

  
  const validated = Joi.validate(query, mutateDomainSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId,add, remove} = validated.value;
  
  try {
    const {db} = getState()
    const driveDb = db.collection('drive');
    const driveData = await dispatch(queryOne({driveId, fields: ['domains']}));
    if (!driveData) return reject(new Error('DRIVE_NOT_FOUND'));
    const nextDomains = driveData.domains.slice()
      .filter(item => remove.includes(item))
      .concat(add)
    await driveDb.findOneAndUpdate({_id: driveId}, {$set: {domains: nextDomains}})
    resolve({})
  } catch(e){
    reject(e)
  }
})


export const createApp = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    appName: Joi.string().required()
  }), {allowUnknown: true})
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName} = validated.value;

  try {
    const {db} = getState()
    const {session} = getState().request.headers;
    if (!session) return reject(new Error('PERMISSION_DENIED'));
    const appDb = db.collection('app');
    let app = await appDb.findOne({appName});
    if (app !== null) return reject(new Error('APP_NAME_EXIST'));

    app = (await appDb.insertOne({
      appName,
      permissions: [],
      adminId: session.userId
    })).ops[0]

    resolve({...app, appId: app._id})
  } catch(e){
    reject(e)
  }
});

export const disableDomain = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const mutateDisableSchema = Joi.object().keys({
    driveId: Joi.string().required()
  })
  const validated = Joi.validate(query, mutateDisableSchema, {allowUnknown: true})
  const {driveId} = validated.value;
  try {
    const {db} = getState()
    const driveDb = db.collection('drive');
    await driveDb.findOneAndUpdate({_id: driveId}, {$set: {status: 0}})
    resolve({ok: 'ok'})
  } catch(e){
    reject(e)
  }
})


export const mutateLocation = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const mutateLocationSchema = Joi.object().keys({
    driveId: Joi.string().required(),
    locations: Joi.array().required(),
  })
  const validated = Joi.validate(query, mutateLocationSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {locations, driveId} = validated.value;
  
  try {
    const {db, request: {headers: {session}}} = getState()
    const {userId} = session;
    const driveDb = db.collection('drive');
    const locationResult = await driveDb.findOne({_id: driveId});
    locationResult.users = locationResult.users.filter(item => item !== userId).concat([userId]);
    locationResult.locations = locations;
    await driveDb.findOneAndUpdate({_id: driveId}, {$set: locationResult});
    resolve({success:1});
  } catch(e){
    reject(e)
  }
});
