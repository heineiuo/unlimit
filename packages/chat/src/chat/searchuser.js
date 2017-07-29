import { handleActions } from 'redux-actions'
import {POSTUrlencodeJSON} from '../utils/fetch-tools'
import {API_HOST, CHAT_API_HOST} from '../utils/config'

const initialState = {
  loading: false,
  list: []
};

export default handleActions({

  SEARCH_USER_LOADING () {
    return {loading: true, list: []}
  },

  SEARCH_USER_RESULT (state, action) {
    return Object.assign({}, state, action.payload, {loading: false})
  },

}, initialState)


export const searchUser = (keyword) => async (dispatch, getState) => {
  try {

    dispatch({
      type: 'SEARCH_USER_LOADING'
    });

    const {token} = getState().account;
    let result = await POSTUrlencodeJSON(`${API_HOST}/index.php?act=api&op=searchUser`, {
      token,
      s: keyword
    });
    if (result.status == 'fail') throw result.msg;
    result = result.map(item => {
      if (item.pals_ico.indexOf('http') != 0) {
        item.pals_ico = `http://www.258m.com/data/upload/shop/avatar/${item.pals_ico}`
      }
      return item;
    });
    dispatch({
      type: 'SEARCH_USER_RESULT',
      payload: {
        list: result
      }
    })

  } catch(e){
    dispatch({
      type: 'SEARCH_USER_RESULT',
      payload: {list: []}
    });
    console.error(e.stack||e)
    alert(e+'searchuser')
  }
};

export const clearSearch = () => ({
  type: 'SEARCH_USER_RESULT',
  payload: {list: []}
});