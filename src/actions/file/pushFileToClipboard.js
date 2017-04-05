/**
 * 将文件添加到剪贴板
 */
const pushFileToClipboard = (files) => (dispatch, getState) => {
  const {clipboard} = getState().file;
  const nextClipboard = clipboard.slice().filter(item => {
    return files.indexOf(item) === -1
  }).concat(files);
  dispatch({
    type: 'file__clipboardUpdate',
    payload: {
      clipboard: nextClipboard
    }
  })
};

export default module.exports = pushFileToClipboard;