import {Model} from '../../utils/spruce'

/**
 * Group:
 * group_${groupName}:
 *  {
 *
 *  appName: 'account',
 *  permission: ['admin']
 *  list: [
 *   {
 *     appId: 'fdada-gfdh213-123hfkaj-123412',
 *     socketId: '/#fafdg213',
 *     status: 1
 *    }, {...}
 *  ]
 *
 *  }
 */

const Group = new Model('Group', {});

/**
 * get group list
 * @returns {Promise}
 */
Group.list = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await Group.find({prefix: 'group_'})
      resolve(list)
    } catch(e){
      if (typeof e == 'string') return reject(e)
      console.log(e)
      reject('NOT_FOUND')
    }
  })
}

/**
 * get group detail
 * @returns {Promise}
 */
Group.detail = (groupName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const detail = await Group.get(`group_${groupName}`)
      resolve(detail)
    } catch(e){
      try {
        const detail = {
          appName: groupName,
          permission: [],
          list: []
        }
        await Group.put(`group_${groupName}`, detail)
        resolve(detail)
      } catch(e){
        if (typeof e == 'string') return reject(e)
        console.log(e)
        reject('NOT_FOUND')
      }
    }
  })


}


/**
 * delete a group and all related sockets
 * @param groupName
 * @returns {Promise}
 * @constructor
 */
Group.delete = (groupName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const detail = await Group.get(`group_${groupName}`)
      await Promise.all(detail.list.map(item => {
        return new Promise(async (resolve, reject) => {
          if (item.socketId == '') return resolve()
          try {
            await Group.del(`socket_${item.socketId}`)
            resolve()
          } catch(e){
            reject(e)
          }
        })
      }));
      await Group.del(`group_${groupName}`)
      resolve()
    } catch(e){
      if (typeof e == 'string') return reject(e)
      console.log(e)
      reject('NOT_FOUND')
    }
  })
};


export default Group
