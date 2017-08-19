import queryOne from '../client/queryOne'


/**
 * 根据 socketId / switch-identify 获取app信息
 * @returns {Promise}
 */
export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const {headers} = query;
  let session = {};
  try {
    if (headers.hasOwnProperty('switch-identity')) {
      const {appSecret: token, appName: name} = headers['switch-identity'];
      const type = name === 'user' ? 'user' : 'app'
      if (token) {
        session = await dispatch(queryOne({token, withSourceData: true}))
      }
    } else if (query.socketId) {
      const socketdb = getState().db.collection('socket');
      session = await socketdb.findOne({_id: query.socketId});
    }
  } catch(e){
    
  }
  resolve(session);
});

