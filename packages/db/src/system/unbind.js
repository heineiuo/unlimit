import Joi from 'joi'
import mutateUpdateStatus from '../client/mutateUpdateStatus'

export const validate = query => Joi.validate(query, Joi.object().keys({
  socketId: Joi.string().required()
}));

/**
 * delete socket
 */
export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = validate(query)
  if (validated.error) return reject(validated.error);
  const {socketId} = validated.value;

  try {
    await mutateUpdateStatus({
      toStatus: 1,
      socketId
    })
  } catch(e){
    console.log(e)
  }

  resolve({})
});
