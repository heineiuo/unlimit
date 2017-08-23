import Joi from 'joi'
import mutateUpdateStatus from '../client/mutateUpdateStatus'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  socketId: Joi.string().required(),
  registerInfo: Joi.object().required(),
}), {allowUnknown: true});

/**
 * 绑定app到socket /socket/add
 * @param query.socketId
 * @param query.registerInfo
 * @returns {Promise}
 */
export default (query) => (dispatch, getState) => new Promise(async(resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {socketId, registerInfo: {appName, appId, appSecret}} = validated.value;

  try {
    await dispatch(mutateUpdateStatus({
      id: appId,
      token: appSecret,
      name: appName,
      toStatus: 2,
      socketId,
    }));
    resolve({socketId})
  } catch (e) {
    reject(e);
  }
});
