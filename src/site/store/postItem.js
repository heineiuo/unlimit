import { handleActions } from 'redux-actions'
import {showError} from './notice'
import {POSTRawJSON} from 'fetch-tools'

const API_HOST = process.env.NODE_ENV == 'production'?
  'https://www.youkuohao.com/api':
  'http://127.0.0.1:8080/api/draft';
const ACCOUNT_HOST = 'https://www.youkuohao.com/account';
const THIS_HOST = 'https://www.youkuohao.com/draft';
const signature = (params) => params;
const api = (params) => POSTRawJSON(`${API_HOST}`, signature(params));

const initialState = {
  pending: false,
  isFound: false,
  detail: {},
};

export default handleActions({

  POST_ITEM_UPDATE (state, action) {
    const {payload} = action;
    return Object.assign({}, state, {pending: false, isFound: true}, {
      detail: payload
    })
  },

  POST_ITEM_NOT_FOUND (state, action) {
    return initialState
  },

}, initialState)


export const queryPostDetail = (id) => async(dispatch, getState) => {
  try {
    const result = await api({
      id,
      modelName: 'post',
      action: 'queryPostDetail'
    });
    if (result.hasOwnProperty('error')) {
      if (result.error == 'NOT_FOUND') {
        return dispatch({
          type: 'POST_ITEM_NOT_FOUND'
        })
      }
      return showError(result.error);
    }
    dispatch({
      type: 'POST_ITEM_UPDATE',
      payload: result
    })

  } catch(e){
    showError(e)
  }
};