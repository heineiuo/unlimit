import showError from './showError'
import {POSTRawJSON} from "fetch-tools"
import {API_HOST, driveId} from "../constants"

export default (topicId) => async (dispatch, getState) => {
  const {post} = getState();
  console.log(topicId);
  if (post.currentTopicId === topicId && post.currentTopicState === 2) return null;

  dispatch({
    type: "topic__detailUpdate",
    payload: {
      currentTopicId: topicId,
      currentTopicState: 1,
    }
  })

  let result = {};
  try {
    result = await POSTRawJSON(`${API_HOST}/catblog/topic/get`, {
      driveId,
      topicId,
    })
  } catch (e) {
    result.error = e;
  }

  if (result.error) {
    if (result.error === 'NOT_FOUND') {
      return dispatch({
        type: 'topic__detailUpdate',
        payload: {
          currentTopicId: topicId,
          currentTopicState: 3,
        }
      })
    }
    return showError(result.error);
  }

  dispatch({
    type: 'topic__detailUpdate',
    payload: {
      currentTopicId: topicId,
      currentTopicState: 2,
      currentTopicDetail: result
    }
  })
};

