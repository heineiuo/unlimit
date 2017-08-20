
export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const fn = new Function('db', `return ${query.ql}`)
    const data = await fn(getState().db)
    resolve({data})
  } catch(e){
    reject(e)
  }
})
