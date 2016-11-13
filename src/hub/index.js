import http from 'http'
import {SeashellChalk} from '../utils/seashell-chalk'
import App from '../intergation/service/app'
import Group from '../intergation/service/group'
import Log from '../intergation/service/log'
import Socket from '../intergation/service/socket'
import defaultConfig from '../hub/defaultconfig'
import SocketIO from 'socket.io'
import handleRequest from '../hub/handleRequest'
import handleResponse from '../hub/handleResponse'
import handleRegister from '../hub/handleRegister'

/****************
 *
 * INIT Service
 *
 **************/
const createIO = (config=defaultConfig, app) => new Promise(async (resolve, reject) => {

  try {

    /**
     * Create a socket instance
     */
    const io = app?SocketIO(app):SocketIO();


    /**
     * empty old registered services
     */
    await Socket.empty();

    /**
     * import preset services
     */
    await Promise.all(config.presets.map(App.importFromConfig));
    /**
     * handle socket connection
     */
    io.on('connection', (socket) => {
      console.log(`${SeashellChalk} new connection ${socket.id}`);
      socket.on('REGISTER', (data) => {
        handleRegister(socket, data, io)
      });
      socket.on('I_HAVE_A_REQUEST', (request) => {
        handleRequest(socket, request, io)
      });
      socket.on('I_HAVE_HANDLE_THIS_REQUEST', (response) => {
        handleResponse(socket, response, io)
      });

      /**
       * handle disconnect
       */
      socket.on('disconnect', () => {
        const deleteSocket = async(socketId, retry = 0) => {
          try {
            console.log(`${SeashellChalk} ${socketId} disconnected`);
            await Socket.delete(socketId)
          } catch (e) {
            if (retry < 3) {
              retry++;
              deleteSocket(socketId, retry)
            }
          }
        };
        deleteSocket(socket.id)
      })
    });

    console.log(`${SeashellChalk} Hub created.`);
    resolve(io);

  } catch (e) {
    console.log(e.stack || e);
    reject(e)
  }
});

export const createIOMiddleware = (config=defaultConfig, app) => new Promise(async (resolve, reject) => {
  try {
    const io = await createIO(config, app)
    resolve((req, res, next) => {
      res.seashell = {
        request: () => {},
        hub : io
      };
      next()
    })
  } catch(e){
    reject(e)
  }
});

export default createIO