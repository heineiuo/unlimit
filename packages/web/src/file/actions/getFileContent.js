import Fetch from '@shared/fetch'

export default (driveId) => async (dispatch, getState) => {
  dispatch({
    type: '@@file/state/update',
    payload: {
      fileContentState: 1
    }
  });

  const {account: {token}, file: {fileId}} = getState();
  const result = await new Fetch(`${global.__SMILE_API}/seashell/fs/queryFileContent`, {
    driveId,
    fileId,
    token
  }).post();

  if (result.error) return console.log(result.error)

  if (typeof result.cat === 'object' && result.cat.data instanceof Array) {
    result.cat = new Buffer(result.cat).toString('utf8')
  }

  dispatch({
      type: '@@file/content/update',
      payload: result
    })
};



/**
 * Converts an array buffer to a string
 *
 * @private
 * @param {ArrayBuffer} buf The buffer to convert
 * @param {Function} callback The function to call when conversion is complete
 */
function _arrayBufferToString(buf, callback) {
  var bb = new Blob([new Uint8Array(buf)]);
  var f = new FileReader();
  f.onload = function(e) {
    callback(e.target.result);
  };
  f.readAsText(bb);
}
