import uuid from 'uuid'
import {Model} from 'sprucejs'
import crypto from 'crypto'

const createSecret = () => crypto.randomBytes(512).toString('hex');


class App extends Model {

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

  schema = {
    appId: String,
    appName: String,
    appSecret: String
  };

  Get = (appId) => new Promise(async (resolve, reject) => {
    try {
      const {db, reducers} = this.props;
      const app = await db.get(appId);
      resolve(app)
    } catch(e){
      reject(new Error('App Not Found'))
    }
  });

  /**
   * app create
   */
  create = (query) => new Promise(async (resolve, reject) => {
    try {
      const {appName} = query;
      const {db, reducers} = this.props;
      const nextService = {
        appId: uuid.v1(),
        appName: appName,
        appSecret: createSecret().toString(10)
      };

      const group = await reducers.Group.detail(appName);
      group.list.push({
        appId: nextService.appId,
        socketId: '',
        status: 0,
      });

      await Promise.all([
        reducers.Group.Put(appName, group, {valueEncoding: 'json'}),
        db.put(nextService.appId, nextService, {valueEncoding: 'json'})
      ]);

      resolve(nextService)
    } catch(e) {
      reject(e)
    }
  });

  /**
   * 导入service
   */
  importFromConfig = (service) => new Promise(async (resolve, reject) => {
    const {db, reducers} = this.props;

    try {
      const group = await reducers.Group.detail(service.appName);
      const index = group.list.findIndex(item => {
        // console.log(item.appId, service.appId);
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
        reducers.Group.Put(service.appName, group),
        db.put(newService.appId, newService)
      ]);

      resolve(newService)
    } catch(e) {
      reject(e)
    }
  });

  list = () => new Promise(async (resolve, reject) => {
    try {
      const {db} = this.props;
      const list = [];
      db.createReadStream({})
        .on('data', (data) => {
          list.push(data)
        })
        .on('end', () => {
          resolve({list})
        });
    } catch(e){
      reject(e)
    }
  });

  remove = (context) => new Promise(async (resolve, reject) => {
    try {
      const {appId} = context;
      const {db} = this.props;
      await db.del(appId);
      resolve({})
    } catch(e){
      reject(e)
    }
  });

  resolve(query) {
    const {action} = query;
    if (action == 'Get') return this.Get(query);
    if (action == 'list') return this.list(query);
    if (action == 'create') return this.create(query);
    if (action == 'remove') return this.remove(query);
    if (action == 'importFromConfig') return this.importFromConfig(query);
    return new Promise((resolve, reject) => reject(new Error('ACTION_NOT_FOUND')))
  }

}

module.exports = App;