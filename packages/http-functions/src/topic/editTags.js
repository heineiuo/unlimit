import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  topicId: Joi.string().required(),
  tags: Joi.string().regex(/^[\u4e00-\u9fa5a-zA-Z0-9,]+$/, 'tags').allow('', null)
}), {allowUnknown: true});


export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    let {topicId, tags=''} = validated.value;
    tags = tags.split(',').map(item => item.trim()).filter(item => item !== '')
    tags.unshift([])
    tags = tags.reduce((left, right) => {
      if (!left.includes(right)) left.push(right)
      return left
    })
    tags = tags.join(',')
    const postDb = getState().db.collection('post');
    const result = await postDb.findOneAndUpdate({_id: topicId}, {$set: {tags}});
    resolve({success: 1})
  } catch(e){
    reject(e)
  }
})
