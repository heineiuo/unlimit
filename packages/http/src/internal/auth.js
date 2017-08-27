import { match, when } from 'match-when'
import Joi from 'joi'
import crypto from 'crypto'

const defaultState = {
  checked: false,
  logged: false
}

export default (state=defaultState, action) => match(action.type, {
  [when('@@auth/SUCCESS')]: () => {
    return action.payload
  },
  [when()]: state
})

const tokens = {}

export const login = query => (dispatch, getState) => new Promise((resolve, reject) => {
  const { UNLIMIT_USERNAME, UNLIMIT_PASSWORD } = process.env
  const validate = query => Joi.validate(query, Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
  }), {allowUnknown: true})
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {username, password} = validated.value;

  if (!(username === UNLIMIT_USERNAME && password === UNLIMIT_PASSWORD)){
    const error = new Error('Error username or password')
    error.name = 'ForbiddenError'
    return reject(error)
  }
  crypto.randomBytes(90, async (err, buf) => {
    if (err) return reject(err)
    try {
      const token = buf.toString('hex')
      tokens[token] = {logged: true, createTime: new Date(), token}
      await dispatch(session({token}))
      resolve(tokens[token])
    } catch(e){
      reject(e)
    }
  })
})

export const logout = ({token}) => (dispatch, getState) => new Promise((resolve, reject) => {
  delete tokens[token]
  resolve()
})

/**
 * @returns {Promise}
 */
export const session = query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  if (getState().auth.checked) return resolve(getState().auth)
  const validate = query => Joi.validate(query, Joi.object().keys({
    token: Joi.string().required(),
  }), {allowUnknown: true})
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const { token } = validated.value;

  if (tokens.hasOwnProperty(token)) {
    const payload = {
      checked: true,
      logged: true
    }
    dispatch({
      type: '@@auth/SUCCESS',
      payload
    })
    return resolve(payload)
  }
  return resolve({
    checked: true,    
    logged: false
  })
})

