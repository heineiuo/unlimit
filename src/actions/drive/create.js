import Joi from 'joi'
import bindDomain from './bindDomain'
import uuid from 'uuid'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  hostnames: Joi.array().required(),
  locations: Joi.array().required()
}), {allowUnknown: true});

/**
 * @api {POST} /drive/create 创建新的域名
 * @apiGroup Host
 * @apiName HostNew
 * @apiSuccess {array} hostnames
 * @apiSuccess {array} locations
 */
export default (query) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const db = getCtx().leveldb.sub('location');
    const {hostnames, locations} = validated.value;
    // await Promise.all(hostnames.map(hostname => shouldNotFound({hostname})));
    const driveId = uuid.v1();
    const {session} = getCtx().request.headers;
    await Promise.all(hostnames.map(hostname => dispatch(bindDomain({hostname, driveId}))));
    await db.put(driveId, {
      hostnames: hostnames,
      locations,
      users: []
    });
    resolve({driveId})
  } catch (e) {
    reject(e)
  }
});
