import showError from './showError'
import {POSTRawJSON} from "fetch-tools"
import {API_HOST, driveId} from "../constants"

export default ({filter, fields}) => async (dispatch, getState) => {
  let result = {};
  try {
    result = await POSTRawJSON(`${API_HOST}/catblog/topic/list`, {
      driveId,
      filter,
      fields
    });
  } catch (e) {
    result.error = e
  }

  if (result.error) {
    if (result.error === 'NOT_FOUND') {
      return dispatch({
        type: 'POST_LIST_NOT_FOUND'
      })
    }
    return showError(result.error);
  }

  const list = result.list.map(item => {
    item.postId = item._id;
    delete item._id;
    return item;
  })

  dispatch({
    type: 'POST_LIST_UPDATE',
    payload: {
      list
    }
  })
};

