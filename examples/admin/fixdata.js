
export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const db = getState().db
    
    resolve({data})
  } catch(e){
    reject(e)
  }
})
