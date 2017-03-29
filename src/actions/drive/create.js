import Joi from 'joi'
import {connect, bindActionCreators} from 'action-creator'
import shouldNotFound from './shouldNotFound'
import commitLocations from './commitLocations'
import unbindDomain from './unbindDomain'
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
const create = (query) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const db = ctx.db.sub('location');
    const {bindDomain, shouldNotFound} = getAction();
    const {hostnames, locations} = validated.value;
    // await Promise.all(hostnames.map(hostname => shouldNotFound({hostname})));
    const driveId = uuid.v1();
    const {session} = ctx.request.headers;
    await Promise.all(hostnames.map(hostname => bindDomain({hostname, driveId})));
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

export default module.exports = connect(
  bindActionCreators({
    shouldNotFound, commitLocations, bindDomain, unbindDomain
  })
)(create)