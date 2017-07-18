const uploadFileToPath = () => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    // url: api['uploadImage'][2]+'?'+encodeQuery(formData),

  } catch(e){
    console.log(e);
  }
};

export default module.exports = uploadFileToPath;