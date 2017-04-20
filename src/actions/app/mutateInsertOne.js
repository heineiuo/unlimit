/* @public */

/**
 * Create App Group
 */

import Joi from 'joi'

export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required()
}), {allowUnknown: true})

const queryLevel = (db, key) => new Promise(async resolve => {
  try {
    resolve(await db.get(key))
  } catch(e){
    resolve(null)
  }
})


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName} = validated.value;

  try {
    const db = getCtx().leveldb.sub('app');

    /**
     * app:
     *  {
     *
     *  appName: 'account',
     *  permission: ['admin']
     *  list: [
     *   {
     *     appId: 'fdada-gfdh213-123hfkaj-123412',
     *     socketId: '/#fafdg213',
     *     status: 1
     *    }, {...}
     *  ]
     *
     *  }
     */
    const app = {
      appName,
      permission: [],
      list: []
    };
    const current = await queryLevel(db, appName)
    if (!current) return reject(new Error('APP_HAS_EXIST'))
    await db.put(appName, app);
    resolve(app)
  } catch(e){
    reject(e)
  }
});

