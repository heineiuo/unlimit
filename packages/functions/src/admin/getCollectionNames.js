
export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    resolve({result: getState().db.getCollectionNames()})
  } catch(e){
    reject(e)
  }
})
