import { handleActions } from 'redux-actions'
import { injectAsyncReducer } from '@react-web/store'

const initialState = {
  title: ''
};

injectAsyncReducer('nav', handleActions({

  nav__titleUpdate (state, action) {
    return Object.assign({}, state, {
      title: action.payload.title
    })
  }

}, initialState))


export const setTitle = (title) => {
  document.title = title;
  return {
    type: 'nav__titleUpdate',
    payload: {title}
  }
};

