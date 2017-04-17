import path from 'path'
import Joi from 'joi'
import getConfig from '../../config'
import getMongodb from '../../mongodb'
import mutateInsertOne from './mutateInsertOne'

export const validate = query => Joi.validate(query, Joi.object().keys({
  driveId: Joi.string().required(),
  parentId: Joi.string().allow(null).default(null),
  uploadKey: Joi.string().default('file')
}), {allowUnknown: true})

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {driveId, parentId, uploadKey} = validated.value;
  getCtx().setHeader({__UPLOAD: true});

  try {
    resolve({parentId, driveId, uploadKey})
  } catch(e){
    reject(e)
  }
});
