import Fetch from '@shared/fetch'
const {API_HOST} = global


export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  let result = null
  const {account: {token}} = getState();
  const {tags, topicId} = query;
  try {
    result = await new Fetch(`${API_HOST}/seashell/topic/editTags`, {
      tags, token, topicId
    }).post();
    if (result.error) {
      return reject(result.error)
    }
  } catch(e){
    return reject(e)
  }

  resolve()
})
