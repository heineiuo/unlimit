import {Model} from '../../utils/spruce'
import Group from './group'

/**
 * Socket
 * socket_${socketId}:
 *  {
 *   appId: 'aaa-fag-gafd123f-g123123-fda-123',
 *   appName: 'account',
 *   permission: ['admin'],
 *   socketId: 'ccc'
 *  }
 *
 */

const Socket = new Model('Socket', {});

/**
 * empty all sockets records
 * @returns {Promise}
 */
Socket.empty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sockets = await Socket.findAll();
      await Promise.all(sockets.map(item => Socket.del(item._key)));
      const groups = await Group.list();
      await Promise.all(groups.map(group => {
        group.list = group.list.map(item => {
          return {
            appId: item.appId,
            socketId: "",
            status: 0
          }
        })
        return Socket.put(group._key, group)
      }))
      resolve()
    } catch(e){
      if (typeof e == 'string') return reject(e)
      console.log(e.stack||e)
      reject('EMPTY_SOCKET_FAIL')
    }
  })
}

Socket.findAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await Socket.find({prefix: 'socket_'})
      resolve(list)
    } catch(e){
      reject(e)
    }
  })
}


/**
 * delete socket
 */
Socket.delete = (socketId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const socketInfo = await Socket.get(`socket_${socketId}`)
      await Socket.del(`socket_${socketId}`)
      const group = await Socket.get(`group_${socketInfo.appName}`)
      group.list = group.list.map(item => {
        if (item.appId == socketInfo.appId) {
          item.socketId = ''
          item.status = 0
        }
        return item
      })
      await Socket.put(`group_${socketInfo.appName}`, group)
      resolve(1)
    } catch(e){
      reject(e)
    }
  })
}

/**
 * 根据socketId获取app信息
 * @param socketId
 * @returns {Promise}
 */
Socket.detail = (socketId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const socket = await Socket.get(`socket_${socketId}`, {valueEncoding: 'json'})
      resolve(socket)
    } catch(e){
      if (typeof e == 'string') return reject(e)
      console.log(e)
      reject('NOT_FOUND')
    }
  })
}



/**
 * get socket by appId
 * @param appId
 * @returns {Promise}
 */
Socket.findByAppId = (appId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const app = await Socket.get(`app_${appId}`)
      const group = await Socket.get(`group_${app.appName}`)
      const targetAppIndex = group.list.findIndex(item => item.appId == appId)
      if (targetAppIndex < 0) throw 'APP_NOT_FOUND'
      const socket = await Socket.get(`socket_${group.list[targetAppIndex].socketId}`)
      resolve(socket)
    } catch(e) {
      console.log(e.stack||e)
      reject(e)
    }
  })
}

/**
 * 绑定app到socket
 * @param socketId
 * @param registerInfo
 * @returns {Promise}
 */
Socket.bindApp = (socketId, registerInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const app = await Socket.get(`app_${registerInfo.appId}`)
      if (app.appSecret != registerInfo.appSecret) throw 'ERROR_REGISTER_INFO'
      const socketData = Object.assign({}, app, {socketId: socketId})
      await Socket.put(`socket_${socketId}`, socketData)
      const group = await Group.detail(app.appName)
      const targetAppIndex = group.list.findIndex(item => item.appId == app.appId)
      group.list[targetAppIndex] = Object.assign({}, group.list[targetAppIndex], {socketId: socketId, status: 1})
      await Socket.put(`group_${app.appName}`, group)
      resolve(socketData)
    } catch(e){
      if (typeof e == 'string') return reject(e)
      console.log(e)
      reject('REGISTER_FAIL')
    }
  })
}

/**
 * 获取处理请求的app, 并作负载均衡
 */
Socket.balance = (importAppName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await Socket.get(`group_${importAppName}`, {valueEncoding: 'json'})
      const onlineItems = group.list.filter(service => service.status == 1)
      if (onlineItems.length == 0) throw 'TARGET_SERVICE_OFFLINE'
      if (onlineItems.length == 1) return resolve(onlineItems[0].socketId)
      const ts = String(Date.now())
      const randomNumber = Number(ts[ts.length - 1])
      const randomIndex = Math.floor(randomNumber * onlineItems.length / 10)
      return resolve(group[randomIndex].socketId)
    } catch(e){
      if (typeof e == 'string') {
        console.log(e)
        return reject(e)
      }
      console.log(e.stack||e)
      reject('GET_SOCKET_FAIL')
    }
  })
}

export default module.exports = Socket
