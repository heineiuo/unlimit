import SocketIO from 'socket.io'
import Emitter from 'events'
// import Emitter from './Emitter'
import uuid from 'uuid'
import chalk from 'chalk'
import {combineReducers} from 'sprucejs'

const SeashellChalk = chalk.blue.bold('[Seashell]');

class ServiceHub {

  constructor (app, db){

    this.db = db;

    const handler = combineReducers([
      require('../integration/service/socket')
    ])(db);

    const createQuery = (action) => (params) => handler({
      reducerName: 'socket',
      action,
      ...params
    });

    this.Socket = {
      detail: createQuery('detail'),
      delete: createQuery('delete'),
      findByAppId: createQuery('findByAppId'),
      balance: createQuery('balance'),
      bindApp: createQuery('bindApp')
    };

    /**
     * Create a socket instance
     */
    const io = app?SocketIO(app):SocketIO();

    /**
     * handle socket connection
     */
    io.on('connection', (socket) => {
      console.log(`${SeashellChalk} new connection ${socket.id}`);
      socket.on('REGISTER', (data) => {
        this.register(socket, data, io)
      });
      socket.on('I_HAVE_A_REQUEST', (request) => {
        this.request(request, socket, io)
      });
      socket.on('I_HAVE_HANDLE_THIS_REQUEST', (response) => {
        this.response(socket, response, io)
      });

      /**
       * handle disconnect
       */
      socket.on('disconnect', () => {
        const deleteSocket = async(socketId, retry = 0) => {
          try {
            console.log(`${SeashellChalk} ${socketId} disconnected`);
            await this.Socket.delete({socketId})
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

    this.io = io;
  }

  integrationEmitterStack = {};

  integrations = {};

  integrate = (integration) => {
    const {integrations, integrationEmitterStack} = this;
    const {name, router} = integration;
    integrations[name] = {
      router,
      request: (url, data) => {
        if (typeof data != 'object') throw `${SeashellChalk} request data must be an object.`;
        return new Promise(async (resolve, reject) => {
          try {
            /**
             * parse url, create req object
             */
            const callbackId = uuid.v1();
            const req = {
              body: data,
              headers: {
                appName: name,
                callbackId: callbackId
              }
            };
            const s = url.search('/');
            if (s < 0) {
              req.headers.importAppName = url;
              req.headers.originUrl = '/'
            } else {
              const sUrl = s == 0 ? url.substr(1) : url;
              let ss = sUrl.search('/');
              req.headers.importAppName = ss > -1 ? sUrl.substring(0, ss) : sUrl;
              req.headers.originUrl = ss > -1 ? sUrl.substring(ss) : '/'
            }

            console.log(`${SeashellChalk} Integration ${name} Start request: ${url}`);

            /**
             * set callback
             * @type {Emitter}
             */
            integrationEmitterStack[callbackId] = new Emitter();
            integrationEmitterStack[callbackId].on('RESPONSE', (res) => {
              console.log('INTEGRATION_GOT_RES');
              resolve(res);
              delete integrationEmitterStack[callbackId];
              return null
            });

            /**
             * send request
             */
            console.log(`request has sent`);
            await this.request(req, {integration: true})
          } catch(e){
            console.log(e.stack||e);
            reject(e)
          }
        })
      }
    };

    router.request = integrations[name].request;
    this.integrations = integrations;
    return integrations[name]
  };


  /**
   * register app
   * @param socket
   * @param data
   * @param io
   * @returns {Emitter|Namespace|Socket|*}
   */
  register = async (socket, data, io) => {
    try {
      if (!socket.id) throw 'LOST_SOCKET_ID';
      const registerInfo = {
        appName: data.appName,
        appId: data.appId,
        appSecret: data.appSecret
      };

      const socketData = await this.Socket.bindApp({socketId: socket.id, registerInfo});
      console.log(`${SeashellChalk} register success, data: ${JSON.stringify(data)}`);
      socket.emit('YOUR_REGISTER_HAS_RESPONSE', {success: 1, socketData: socketData})
    } catch(e){
      console.log(`${SeashellChalk} register failed, data: ${data}`);
      const error = typeof e == 'string'? e : 'EXCEPTION_ERROR';
      socket.emit('YOUR_REGISTER_HAS_RESPONSE', {error})
    }
  };

  request = (req, socket) => new Promise(async (resolve, reject) => {

    try {
      const {io} = this;
      if (!req.headers.callbackId) throw new Error('LOST_CALLBACK_ID');
      req.headers.__SEASHELL_START = Date.now();

      const {importAppName} = req.headers;
      const isIntegration = socket.hasOwnProperty('integration');
      const isRequestIntegration = this.integrations.hasOwnProperty(importAppName);

      /**
       * 验证请求是否合法,
       * 如果请求来自集成服务, 不判断
       */
      if (!isIntegration) {
        const reqService = await this.Socket.detail({socketId: socket.id});
        console.log(`${SeashellChalk} ${reqService.appName} --> ${req.headers.importAppName}${req.headers.originUrl}`);
      }

      /**
       * 如果请求的是集成服务, 则直接调用
       * 否则验证目标app是否在线, 并发包给目标app
       */
      if (isRequestIntegration) {
        const result = await this._requestIntegration(importAppName, socket, req);
        if (isIntegration) {
          this.integrationEmitterStack[req.headers.callbackId].emit('RESPONSE', result);
          return resolve();
        }
        console.log(`YOUR_REQUEST_HAS_RESPONSE`);
        socket.emit('YOUR_REQUEST_HAS_RESPONSE', result);
        resolve();
      }
      const resServiceId = await this.Socket.balance({importAppName});
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
      );
      resolve()
    }
  });

  _requestIntegration = (integrationName, reqSocket, req) => new Promise(async (resolve) => {
    const { handleLoop } = this.integrations[integrationName].router;
    console.log(`${SeashellChalk} handle admin request: ${JSON.stringify(req)}`);
    const res = {
      headers: {
        appId: req.headers.appId,
        callbackId: req.headers.callbackId
      },
      body: {},
      end: () => {
        // resolve({
        //   headers: res.headers,
        //   body: res.body
        // })
        resolve(res)
      }
    };
    const next = (err, req, res, index, pathname) => {
      return handleLoop(err, req, res, next, index, pathname)
    };
    next(null, req, res, 0, req.headers.originUrl)
  });

  /**
   * handle `callback`
   * @return response.appId `response header's app id`
   * @return response.callbackId `callbackId`
   * @return response.data `response body`
   */
  response = (socket, res, io) => new Promise(async (resolve ) => {
    try {
      if (!res.headers.appId) {
        if (!res.headers.appName) throw new Error('Export Lost appName!');
        if (this.integrations.hasOwnProperty(res.headers.appName)) {
          return this.integrationEmitterStack[res.headers.callbackId].emit('RESPONSE', res)
        }
        throw new Error('Export Lost Params: [appId]');
      }
      if (!res.headers.callbackId) throw new Error('Export Lost Params: [callbackId]');

      /**
       * 根据appId找到socket
       * 如果目标在线, 发送消息
       */
      const reqSocket = await this.Socket.findByAppId({appId: res.headers.appId});
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
  });

}

export default ServiceHub