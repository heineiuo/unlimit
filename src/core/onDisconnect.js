import {SeashellDebug} from './seashell-debug'

const onDisconnect = (socket) => {
  const {Socket} = this;
  const deleteSocket = async(socketId, retry = 0) => {
    try {
      SeashellDebug(`${socketId} disconnected`);
      await Socket.remove({socketId})
    } catch (e) {
      if (retry < 3) {
        retry++;
        deleteSocket(socketId, retry)
      }
    }
  };
  deleteSocket(socket.id)
};

export {
  onDisconnect
}