import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
const {API_HOST} = global
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
    result = await new Fetch(`${API_HOST}/catblog/topic/create`, {
      token,
      driveId,
      title,
      content,
      html
    }).post();
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

