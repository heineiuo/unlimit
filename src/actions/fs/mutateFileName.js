import Joi from 'joi'
import {ObjectId} from 'mongodb'
import getMongodb from '../../mongodb'
import getLeveldb from '../../leveldb'


export const validate = query => Joi.validate(query, Joi.object().keys({
  fileId: Joi.string().required(),
  fileName: Joi.string().required()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {fileId, fileName} = validated.value;

  try {
    const file = (await getMongodb()).collection('file');
    const fileData = await file.findOne({_id: ObjectId(fileId)});
    if (!fileData) return reject(new Error('NOT_FOUND'));
    const {parentId, driveId, name} = fileData;
    if (name === fileName) return resolve({});
    const sameName = await file.findOne({driveId, parentId, name: fileName});
    if (sameName) return reject(new Error('NAME_CONFLICT'));
    const result = await file.findOneAndUpdate({_id: ObjectId(fileId)}, {$set: {name: fileName}})
    resolve(result)
  } catch(e) {
    reject(e)
  }
})
