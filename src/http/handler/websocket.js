/**
 * Copyright heineiuo
 * @provideModule socket middleware
 */

import SocketIO from 'socket.io'
import Socket from '../../intergation/gateway/socket'
import config from '../../utils/config'

const socketMiddleware = (app) => {
  const io = SocketIO(app);

  io.on('connection', async (socket) => {
    try {
      await Socket.register(socket);
      socket.emit('news', {hello: 'success'});
    } catch(e){
      if (config.debug) console.log(e.stack||e);
      socket.emit('news', {hello: 'fail'});
      return socket.disconnect()
    }
  });

  return (req, res, next) => {
    res.socketio = io;
    next()
  }
};

export {socketMiddleware}