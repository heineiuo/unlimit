import {POSTRawJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST, signature} from '../../constants'
import {stateToHTML} from 'draft-js-export-html'
import {convertToRaw} from 'draft-js'

export default (query) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const {title, editorState, driveId} = query;
  const contentState = editorState.getCurrentContent();
  const html = stateToHTML(contentState);
  const content = convertToRaw(contentState);

  let result = null;
  try {
    result = await POSTRawJSON(`${API_HOST}/catblog/topic/create`, signature({
      token,
      driveId,
      title,
      content,
      html
    }))
    if (result.error) return console.log(result.error)
  } catch(e){
    return console.log(e)
  }

  dispatch({
    type: 'topic__currentTopicUpdate',
    payload: {
      title,
      content,
      html,
      syncState: 2
    }
  })
  dispatch(push(`/drive/${driveId}/topics/${result.topicId}`))
}

