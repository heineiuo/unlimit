import {SeashellChalk} from '../utils/seashell-chalk'

/**
 * receive request from a app
 * 1. get request data
 * 2. validate app permission
 * 3. pipe request to target app
 */
const handleRequest = async (socket, req, io) => {

  try {
    if (!req.headers.callbackId) throw new Error('LOST_CALLBACK_ID');
    req.headers.__SEASHELL_START = Date.now();

    const importAppName = req.headers.importAppName;
    /**
     * 验证请求是否合法
     */
    const reqService = await Socket.detail(socket.id);

    console.log(`${SeashellChalk} ${reqService.appName} --> ${req.headers.importAppName}${req.headers.originUrl}`);

    /**
     * 如果请求的是admin, 则直接调用admin接口
     */
    if (importAppName == 'admin') return this.handleAdminRequest(socket, req);

    /**
     * 验证目标app是否在线
     */
    const resServiceId = await Socket.balance(importAppName);

    /**
     * 发包给目标app
     */
    io.sockets.connected[resServiceId].emit('PLEASE_HANDLE_THIS_REQUEST', req)

  } catch(e) {
    console.log(e.stack||e);
    const res = {
      headers: {
        callbackId: req.headers.callbackId
      },
      body: {
        error: typeof e == 'string'?e:'HUB_EXCEPTION_ERROR'
      }
    };
    socket.emit('YOUR_REQUEST_HAS_RESPONSE', res);
    console.log(
      `${SeashellChalk} request failed because ${e}`
    )
  }
};

export default handleRequest
