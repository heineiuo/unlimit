import Joi from 'joi'
import pick from 'lodash/pick'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  topicId: Joi.string().required(),
  title: Joi.string().allow(''),
  content: Joi.object(),
  html: Joi.string().allow('')
}), {allowUnknown: true});

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {topicId} = validated.value;
    const postDb = getCtx().db.collection('post');
    const mutate = pick(validated.value, ['html', 'title', 'content']);
    const post = await postDb.findOneAndUpdate({_id: topicId}, {$set: mutate});
    resolve({data: post})
  } catch(e){
    reject(e)
  }
});
