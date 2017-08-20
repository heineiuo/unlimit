/**
 * this result comes from an aggregate cache
 */
import Joi from 'joi'
import updateDriveTags from './updateDriveTags'

export default (query) => (dispatch, getState) => new Promise(async(resolve, reject) => {
  try {
    const {db} = getState()
    let {error, value} = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required()
    }), {allowUnknown: true});
    if (error) return reject(error)
    const {driveId} = value;
    const tagsDb = db.collection('tags');
    const doc = await tagsDb.findOne({driveId}, {fields: ['list', 'time']});
    if (doc === null || Date.now() > doc.time + 1000 * 60 * 60) {
      return resolve(await dispatch(updateDriveTags({driveId})))
    }
    resolve(doc)
  } catch(e){
    if (e.name === `ns doesn't exist`) {
      return resolve({list: []})
    }
    reject(e)
  }
});
