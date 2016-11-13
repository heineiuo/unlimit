import {SeashellChalk} from '../utils/seashell-chalk'

/**
 * handle `callback`
 * @return response.appId `response header's app id`
 * @return response.callbackId `callbackId`
 * @return response.data `response body`
 */
const handleResponse = async (socket, res, io) => {

  try {
    if (!res.headers.appId) throw new Error('Export Lost Params: [appId]');
    if (!res.headers.callbackId) throw new Error('Export Lost Params: [callbackId]');

    /**
     * 根据appId找到socket
     * 如果目标在线, 发送消息
     */
    const reqSocket = await Socket.findByAppId(res.headers.appId);
    io.sockets.connected[reqSocket.socketId].emit('YOUR_REQUEST_HAS_RESPONSE', res);
    console.log(
      `${SeashellChalk} ${reqSocket.appName} <-- ${res.headers.importAppName}${res.headers.originUrl},` +
      ` total spend ${Date.now() - res.headers.__SEASHELL_START}ms`
    )

  } catch(e) {
    if (e == 'REQUEST_SOCKET_OFFLINE') {
      // todo add to task, when socket connected again, send res again.
      return console.log(`${SeashellChalk} reqSocket offline`)
    }
    console.log(e.stack||e)
  }
};

export default handleResponse