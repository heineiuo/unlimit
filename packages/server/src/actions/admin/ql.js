
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const fn = new Function('db', `return ${query.ql}`)
    const data = await fn(getCtx().db)
    resolve({data})
  } catch(e){
    reject(e)
  }
})
