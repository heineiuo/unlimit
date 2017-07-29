import Fetch from '@shared/fetch'
const {API_HOST} = global

export const allStatus = ['草稿', '已发布', '已下线']

export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const {account: {token}} = getState();
  const {status, topicId} = query;
  const result = await new Fetch(`${API_HOST}/catblog/topic/editStatus`, {
    status, token, topicId
  }).post()

  if (result.error) return reject(result.error)
  resolve()
})
