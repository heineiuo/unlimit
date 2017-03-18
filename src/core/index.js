import SocketIO from 'socket.io'
import {SeashellDebug} from './debug'
import {integrate} from './integrate'
import {onRegister} from './onRegister'
import {onRequest} from './onRequest'
import {onResponse} from './onResponse'
import {onDisconnect} from './onDisconnect'
import {requestIntegration} from './requestIntegration'

class Seashell {

  constructor () {

    /**
     * Create a socket instance
     */
    this.io = SocketIO();

    /**
     * handle socket connection
     */
    this.io.on('connection', (socket) => {
      if (!this.Socket) {
        socket.emit('ExceptionError');
        return null
      }
      SeashellDebug('INFO', `new connection ${socket.id}`);

      /**
       * service register
       */
      socket.on('REGISTER', (data) => {
        this.onRegister(socket, data)
      });

      /**
       * service want to request another service
       */
      socket.on('I_HAVE_A_REQUEST', (request) => {
        this.onRequest(socket, request)
      });

      /**
       * service has handled request from another, transfer data back to that.
        */
      socket.on('I_HAVE_HANDLE_THIS_REQUEST', (response) => {
        this.onResponse(socket, response)
      });

      /**
       * handle disconnect
       */
      socket.on('disconnect', () => {
        this.onDisconnect(socket)
      })
    });
  }

  Socket = {};
  integrationEmitterStack = {};
  integrations = {};
  integrate = integrate.bind(this);
  _requestIntegration = requestIntegration.bind(this);
  onRegister = onRegister.bind(this);
  onRequest = onRequest.bind(this);
  onResponse = onResponse.bind(this);
  onDisconnect = onDisconnect.bind(this);

}

export default Seashell