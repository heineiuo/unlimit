import { handleActions } from 'redux-actions'

const initialState = {
  current: {
    title: "默认主题",
    mainColor: "#FF7105"
  }
};

const noop = () => {};

export default handleActions({

  CHANGE_THEME: (state, action) => {
    return Object.assign({}, state, {
      current: action.payload
    })
  }

}, initialState)
