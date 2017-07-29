import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
const {API_HOST} = global
import {stateToHTML} from 'draft-js-export-html'
import {convertToRaw} from 'draft-js'

export default (query) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const {title, editorState, tags, topicId} = query;
  const contentState = editorState.getCurrentContent();
  const html = stateToHTML(contentState);
  const content = convertToRaw(contentState);

  const result = await new Fetch(`${API_HOST}/catblog/topic/edit`, {
    token,
    title,
    topicId,
    content,
    html
  }).post()
  if (result.error) return console.log(result.error)


  dispatch({
    type: 'topic__currentTopicUpdate',
    payload: {
      title,
      content,
      html,
      tags,
      syncState: 2
    }
  })
}

