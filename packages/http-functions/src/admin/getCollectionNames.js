
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    resolve({result: getCtx().db.getCollectionNames()})
  } catch(e){
    reject(e)
  }
})
