import { handleActions } from 'redux-actions'
import {showError} from './notice'
// import {api} from './shared/api'

const initialState = {
  list: [],
};


export default handleActions({

  POST_LIST_UPDATE (state, action) {
    const {payload} = action;
    return Object.assign({}, state, {
      list: payload.list
    })
  },

}, initialState);

export const getPostList = () => async(dispatch, getState) => {
  try {
    const result = await api({
      modelName: 'post',
      action: 'list',
    });
    if (result.error) return showError(result.error);
    dispatch({
      type: 'POST_LIST_UPDATE',
      payload: {list: result.result}
    })

  } catch(e){
    showError(e)
  }
};
