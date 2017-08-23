import ent from "ent"

/**
 * 返回html
 */
export default query => (dispatch, getState) => new Promise(resolve => {
  const { content } = query
  const { response: res } = getState()
  res.end(ent.decode(content))
  resolve()
})
