
/**
 * get app list
 * @returns {Promise}
 */
export default ({limit=20}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('app');
    const list = [];
    db.createReadStream({limit:null})
      .on('data', (data) => {
        list.push(data)
      })
      .on('error', (e) => {
        console.log(e)
      })
      .on('end', () => {
        resolve({list})
      });
  } catch(e){
    reject(e)
  }
});
