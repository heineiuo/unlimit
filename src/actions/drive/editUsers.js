import Joi from 'joi'

const editUsers = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {

    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required(),
      add: Joi.array(),
      remove: Joi.array()
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);

    const {driveId, add=[], remove=[]} = validated.value;

    if (add.length >0 || remove.length > 0) {
      const db = getCtx().db.sub('location');
      const drive = await db.get(driveId);
      const currentUsers = drive.users;
      const nextUsers = currentUsers
        .filter(item => (remove.indexOf(item) === -1 || add.indexOf(item) === -1))
        .concat(add);
      const nextDrive = Object.assign({}, drive, {
        users: nextUsers
      })
      await db.put(driveId, nextDrive);
    }

    resolve({success:1});
  } catch(e){
    reject(e)
  }

});

export default module.exports = editUsers