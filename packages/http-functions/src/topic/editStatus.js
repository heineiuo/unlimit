import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  topicId: Joi.string().required(),
  status: Joi.number().min(0).max(2).required()
}), {allowUnknown: true});


export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    let {topicId, status} = validated.value;
    const postDb = getState().db.collection('post');
    const result = await postDb.findOneAndUpdate({_id: topicId}, {$set: {status}});
    resolve({success: 1})
  } catch(e){
    reject(e)
  }
})
