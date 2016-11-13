import uuid from 'uuid'
import {Model} from '../../utils/spruce'
import Group from './group'
import crypto from 'crypto'

const createSecret = () => crypto.randomBytes(512);

/**
 * App:
 *
 * app_${appId}:
 *
 * {
 *  appId: '',
 *  appName: '',
 *  appSecret: ''
 * }
 *
 */

const App = new Model('App', {});

/**
 * app create
 */
App.create = (appName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nextService = {
        appId: uuid.v4(),
        appName: appName,
        appSecret: createSecret()
      };

      const group = await Group.detail(appName)
      group.list.push({
        appId: nextService.appId,
        socketId: '',
        status: 0,
      });

      await Promise.all([
        App.put(`group_${appName}`, group, {valueEncoding: 'json'}),
        App.put(`app_${nextService.appId}`, nextService, {valueEncoding: 'json'})
      ]);

      resolve(nextService)
    } catch(e) {
      if (typeof e == 'string') return reject(e);
      console.log(e);
      reject('CREATE_SERVICE_FAIL')
    }
  })
};

/**
 * 导入service
 */
App.importFromConfig = (service) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await Group.detail(service.appName);
      const index = group.list.findIndex(item => {
        console.log(item.appId, service.appId);
        return item.appId == service.appId
      });

      if (index > -1) return resolve(group.list[index]);

      const newService = {
        appId: service.appId,
        appName: service.appName,
        appSecret: service.appSecret
      };

      group.list.push({
        appId: newService.appId,
        socketId: null,
        status: 0,
      });

      await Promise.all([
        App.put(`group_${service.appName}`, group),
        App.put(`app_${newService.appId}`, newService)
      ]);

      resolve(newService)
    } catch(e) {
      if (typeof e == 'string') return reject(e);
      console.log(e.stack||e);
      reject('CREATE_SERVICE_FAIL')
    }
  })
};

export default App

