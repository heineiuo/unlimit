
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().db
    
    resolve({data})
  } catch(e){
    reject(e)
  }
})
