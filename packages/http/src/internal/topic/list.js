import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  limit: Joi.number(),
  afterId: Joi.string().allow(null),
  filter: Joi.object(),
  driveId: Joi.string(),
  keyword: Joi.string().allow('', null),
  tags: Joi.array().allow(null),
  fields: Joi.array()
}), {allowUnknown: true});


export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {db} = getState();
    const {limit=20, filter={}, driveId=null, tags=[], fields=['html'], afterId=null, keyword=''} = validated.value;
    let allTags = tags ? tags : [];
    const mergedFilter = {
      ...filter,
      driveId,
      $or: []
    }
    const options = {
      fields: [{status: 1}].concat(fields).reduce(
        (left,right) => {
          left[right] = 1;
          return left
        })
    }

    if (afterId) mergedFilter._id = {$gt: afterId}
    if (!keyword) {
      if (allTags.length > 0) mergedFilter.$or.push({tags: {$regex: allTags.join('|')}})
    } else {
      allTags = allTags.concat(keyword.split(/,|\s/).filter(item => item !== ''));
      if (allTags.length > 0) {
        mergedFilter.$or = mergedFilter.$or.concat([
          {tags: {$regex: allTags.join('|')}},
          {title: {$regex: new RegExp(`.*${allTags.join('|')}.*`)}}
        ])
      }
    }
    if (mergedFilter.$or.length === 0) delete mergedFilter.$or;
    const list = await db.collection('post').find(mergedFilter, options).limit(Number(limit)).toArray();
    resolve({list})
  } catch(e){
    reject(e)
  }
});
