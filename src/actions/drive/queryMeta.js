import Joi from 'joi'
import {ObjectId} from 'mongodb'


const queryMetaSchema = Joi.object().keys({
  limit: Joi.number().default(20),
  fields: Joi.array().default(['name', 'locations'])
})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryMetaSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {limit, fields} = validated.value;
  const filter = {}
  const {getMongodb, getLeveldb, getConfig} = getCtx()
  const {session} = getCtx().request.headers;
  if (!session) return reject('PERMISSION_DENIED')
  const userId = session.userId
  filter.users = {$elemMatch: {$eq: userId}}

  try {
    const drive = (await getMongodb()).collection('drive');
    const data = await drive.find(filter, {fields}).limit(limit).toArray();
    resolve({data})
  } catch(e){
    reject(e)
  }
})
