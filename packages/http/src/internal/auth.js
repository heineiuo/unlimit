import { match, when } from 'match-when'
import Joi from 'joi'

const defaultState = {
  
}

export default (state=defaultState, action) => match(action.type, {
  [when()]: state
})

export const session = ({token}) => (dispatch, getState) => new Promise((resolve, reject) => {
  
})

export const login = query => (dispatch, getState) => new Promise((resolve, reject) => {
  
})

export const logout = ({token}) => (dispatch, getState) => new Promise((resolve, reject) => {
  
})




/**
 * get app detail
 * @returns {Promise}
 */
export default querySession = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validate = query => Joi.validate(query, Joi.object().keys({
    appName: Joi.string().required(),
    appToken: Joi.string().length(96).required()
  }), {allowUnknown: true})
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName, appToken} = validated.value;

  try {
    const {db} = getState()
    const apptokenDb = db.collection('apptoken');
    const detail = await apptokenDb.findOne({_id: appToken});
    resolve(detail)
  } catch(e){
    if (e.name !== 'NotFoundError') return reject(new Error('NO_SESSION'));
    reject(e)
  }
})

export const queryUsers = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const queryUserSchema =  Joi.object().keys({
    driveId: Joi.string(),
  })
  const validated = Joi.validate(query, queryUserSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId} = validated.value;
  try {
    const {db} = getState()
    const driveDb = db.collection('drive');
    const filter = {_id: driveId};
    const result = await driveDb.findOne(filter, {fields: {users: 1}})
    if (!result) return reject(new Error('NOT_FOUND'))
    const userDb = db.collection('user')
    let data = await Promise.all(result.users.map(userId => {
      return new Promise(resolve => userDb.findOne({_id: userId})
        .then(resolve)
        .catch(() => resolve(null))
      )
    }))
    data = data.filter(item => item !== null)
    resolve({data})
  } catch(e){
    reject(e)
  }
})
