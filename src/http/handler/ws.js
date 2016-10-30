/**
 * Copyright heineiuo
 * @provideModule socket middleware
 */

import SocketIO from 'socket.io'
import Socket from '../../models/socket'

const socketMiddleware = (app, config) => {
  const io = SocketIO(app);

  io.on('connection', async (socket) => {
    try {
      await Socket.register(socket);
      socket.emit('news', {hello: 'success'});
    } catch(e){
      console.log(e.stack||e);
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