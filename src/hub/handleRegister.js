import {SeashellChalk} from '../utils/seashell-chalk'

/**
 * register app
 * @param socket
 * @param data
 * @param io
 * @returns {Emitter|Namespace|Socket|*}
 */
const handleRegister = async (socket, data, io) => {
  try {
    if (!socket.id) throw 'LOST_SOCKET_ID';

    const insertData = {
      appName: data.appName,
      appId: data.appId,
      appSecret: data.appSecret
    };

    const socketData = await Socket.bindApp(socket.id, insertData);
    console.log(`${SeashellChalk} register success, data: ${JSON.stringify(data)}`);
    socket.emit('YOUR_REGISTER_HAS_RESPONSE', {success: 1, socketData: socketData})
  } catch(e){
    console.log(`${SeashellChalk} register failed, data: ${data}`);
    const error = typeof e == 'string'? e : 'EXCEPTION_ERROR';
    socket.emit('YOUR_REGISTER_HAS_RESPONSE', {error})
  }
};

export default handleRegister