import {POSTRawJSON} from "fetch-tools"
import {API_HOST, signature} from "../../constants"

export default (driveId) => async (dispatch, getStore) => {
  dispatch({
    type: "topic__tagsUpdate",
    payload: {
      tagsUpdateState: 1
    }
  })

  const handleError = (e) => process.nextTick(() => {
    console.log(e);
    dispatch({
      type: "topic__tagsUpdate",
      payload: {
        tagsUpdateState: 3
      }
    })
  })

  const { account: {token}} = getStore();
  let result = null;
  try {
    result = await POSTRawJSON(`${API_HOST}/catblog/tags/getDriveTags`, signature({
      token,
      driveId,
    }))
    if (result.error) return handleError(result.error)
  } catch (e) {
    return handleError(e)
  }

  dispatch({
    type: "topic__tagsUpdate",
    payload: {
      tagsUpdateState: 2,
      tags: result.list
    }
  })
}

