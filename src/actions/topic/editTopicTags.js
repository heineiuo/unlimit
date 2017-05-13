import Fetch from 'fetch-tools'
import {API_HOST, signature} from '../../constants'


export default (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  let result = null
  const {account: {token}} = getState();
  const {tags, topicId} = query;
  try {
    result = await new Fetch(`${API_HOST}/catblog/topic/editTags`, signature({
      tags, token, topicId
    })).post();
    if (result.error) {
      return reject(result.error)
    }
  } catch(e){
    return reject(e)
  }

  resolve()
})
