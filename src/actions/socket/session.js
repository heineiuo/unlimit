import queryOne from '../client/queryOne'

export const queryLevel = (db, key) => new Promise(async resolve => {
  try {
    resolve(await db.get(key))
  } catch(e){
    resolve(null)
  }
})


/**
 * 根据 socketId / switch-identify 获取app信息
 * @returns {Promise}
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const {headers} = query;
  let session = null;
  try {
    if (headers.hasOwnProperty('switch-identity')) {
      const {appSecret: token, appName: name} = headers['switch-identity'];
      const type = name === 'user' ? 'user' : 'app'
      console.log(headers['switch-identity'])
      if (token) {
        session = await dispatch(queryOne({token, withSourceData: true}))
      }
    } else if (query.socketId) {
      const socketdb = getCtx().leveldb.sub('socket');
      session = await queryLevel(socketdb, query.socketId);
    }
  } catch(e){
    console.log(e)
  }
  resolve(session);
});

