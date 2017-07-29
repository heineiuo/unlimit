import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  topicId: Joi.string().required()
}), {allowUnknown: true});


export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {topicId} = validated.value;
    const collection = getCtx().db.collection('post');
    await collection.removeOne({_id: topicId});
    resolve({})
  } catch(e){
    reject(e)
  }
});
