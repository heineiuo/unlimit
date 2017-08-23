export default query => (dispatch, getState) => new Promise((resolve, reject) => {
  const { response: res } = getState()
  res.json(query)
  resolve()
})
