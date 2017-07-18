import Fetch from "@shared/fetch"
const {API_HOST} = global

const defaultOptions = {
  sort: {
    time: 1
  },
  keyword: '', //a,b,c
  afterId: null,
}

export default (driveId, customOptions) => async (dispatch, getStore) => {
  dispatch({
    type: "topic__listUpdate",
    payload: {
      listUpdateState: 1
    }
  })

  const options = Object.assign({}, defaultOptions, customOptions)

  const handleError = (e) => process.nextTick(() => {
    console.log(e);
    dispatch({
      type: "topic__listUpdate",
      payload: {
        listUpdateState: 3
      }
    })
  })

  const {topic: {list}, account: {token}} = getStore();
  let result = null;
  try {
    result = await new Fetch(`${API_HOST}/catblog/topic/list`, {
      token,
      driveId,
      keyword: options.keyword,
      fields: ['title', 'tags', 'status'],
      afterId: options.afterId,
    }).post();
    if (result.error) return handleError(result.error)
  } catch (e) {
    return handleError(e)
  }

  dispatch({
    type: "topic__listUpdate",
    payload: {
      listUpdateState: 2,
      list: options.afterId ? list.concat(result.list) : result.list
    }
  })
}

