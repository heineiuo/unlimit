import {SeashellDebug} from './seashell-debug'


const onRequest =  async function(socket, req) {

  const {io, integrations, Socket, _requestIntegration, integrationEmitterStack} = this;

  try {
    if (!req.headers.callbackId) throw new Error('LOST_CALLBACK_ID');
    req.headers.__SEASHELL_START = Date.now();

    const {importAppName} = req.headers;
    const isIntegration = socket.hasOwnProperty('integration');
    const isRequestIntegration = integrations.hasOwnProperty(importAppName);

    /**
     * 验证请求是否合法
     * 如果请求来自集成服务, 跳过验证
     */
    if (!isIntegration) {
      const reqService = await Socket.detail({socketId: socket.id});
      SeashellDebug('INFO', `${reqService.appName} --> ${req.headers.importAppName}${req.headers.originUrl}`);
    } else {
      SeashellDebug('INFO', `integration service --> ${req.headers.importAppName}${req.headers.originUrl}`);
    }

    /**
     * 发送请求
     * 如果请求的是集成服务, 则直接调用
     * 否则，先验证目标app是否在线, 在线则发包给目标app
     */
    if (isRequestIntegration) {
      const result = await _requestIntegration(importAppName, socket, req);
      if (isIntegration) {
        integrationEmitterStack[req.headers.callbackId].emit('RESPONSE', result);
      } else {
        socket.emit('YOUR_REQUEST_HAS_RESPONSE', result);
      }
    } else {
      const resServiceId = await Socket.balance({importAppName});
      io.sockets.connected[resServiceId].emit('PLEASE_HANDLE_THIS_REQUEST', req)
    }
  } catch(e) {
    SeashellDebug('ERROR', 'request failed', e);
    const res = {
      headers: {
        callbackId: req.headers.callbackId
      },
      body: {
        error: e.message
      }
    };
    socket.emit('YOUR_REQUEST_HAS_RESPONSE', res);
  }
};

export {
  onRequest
}