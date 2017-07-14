import Joi from 'joi'
import {ObjectId} from 'mongodb'

const queryUserSchema =  Joi.object().keys({
  driveId: Joi.string(),
})


export default query => (dispatch, geCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryUserSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId} = validated.value;
  const {getMongodb, getConfig} = getCtx()
  try {
    const drive = (await getMongodb()).collection('drive');
    const filter = {_id: ObjectId(driveId)};
    const result = await drive.findOne(filter, {fields: {users: 1}})
    if (!result) return reject(new Error('NOT_FOUND'))
    const userdb = (await getMongodb()).collection('user')
    let data = await userdb.find({})
    resolve({data})
  } catch(e){
    reject(e)
  }
})
