
export default (error) => (dispatch, getState) => {
  console.error(error);
  dispatch({
    type: 'NOTICE_PUSH',
    payload: {
      type: 'error',
      error
    }
  })

};
