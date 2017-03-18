import {SeashellDebug} from './seashell-debug'


/**
 * register app
 * @param socket
 * @param data
 * @returns {Emitter|Namespace|Socket|*}
 */
const onRegister = async function(socket, data) {
  const {Socket} = this;

  try {
    if (!socket.id) throw new Error('LOST_SOCKET_ID');
    const registerInfo = {
      appName: data.appName,
      appId: data.appId,
      appSecret: data.appSecret
    };

    const socketData = await Socket.bindApp({socketId: socket.id, registerInfo});
    SeashellDebug('INFO', `register success`, data);
    socket.emit('YOUR_REGISTER_HAS_RESPONSE', {success: 1, socketData: socketData})
  } catch(e){
    SeashellDebug('INFO', 'register failed', data);
    socket.emit('YOUR_REGISTER_HAS_RESPONSE', {error: e.message})
  }
};

export {
  onRegister
}