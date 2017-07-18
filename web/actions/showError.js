const showError = (error) => (dispatch, getState) => {
  dispatch({
    type: 'notice__pushError',
    payload: {
      type: 'error',
      notice: error
    }
  })
};

export default module.exports = showError;