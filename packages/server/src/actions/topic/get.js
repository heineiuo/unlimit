import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  topicId: Joi.string().required()
}), {allowUnknown: true});

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {topicId} = validated.value;
    const postDb = getCtx().db.collection('post');
    const post = await postDb.findOne({_id: topicId});
    if (post === null) return reject(new Error('NOT_FOUND'))
    resolve({...post, topicId: post._id})
  } catch(e){
    reject(e)
  }
});
