import {Model} from "sprucejs"
import Joi from "joi"


class Host extends Model {

  /**
   * @api {POST} /Host/detail 获取域名详情
   * @apiGroup Host
   * @apiName HostDetail
   * @apiParam {string} hostname
   * @apiSuccess {object} host
   */
  detail = (req) => new Promise(async(resolve, reject) => {
    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required()
      }), {allowUnknown: true});

      const {db, reducers} = this.props;
      const {hostname} = req;
      const host = await this.Get(hostname);
      resolve({host})
    } catch (e) {
      reject(e)
    }
  });

  /**
   * @api {POST} /host/list 获取域名列表
   * @apiGroup Host
   * @apiName HostList
   * @apiParam {number} limit 个数限制
   * @apiSuccess {string} list
   */
  list = (req) => new Promise(async(resolve, reject) => {
    try {
      const {db} = this.props;
      const list = await db.find({});
      resolve({list});
    } catch (e) {
      reject(e)
    }
  });

  /**
   * @api {POST} /Host/delete删除host
   * @apiGroup Host
   * @apiName HostDelete
   * @apiParam {string} hostname
   */
  Delete = (req) => new Promise(async(resolve, reject) => {
    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required()
      }), {allowUnknown: true});

      const {db, reducers} = this.props;

      const {hostname} = req;
      await Promise.all([
        db.del(hostname),
        reducers.Location.destroy(hostname)
      ]);
      resolve({})
    } catch (e) {
      reject(e)
    }
  });

  /**
   * @api {POST} /Host/new 创建新的域名
   * @apiGroup Host
   * @apiName HostNew
   * @apiParam {string} hostname
   * @apiSuccess {string} hostname
   */
  New = (query) => new Promise(async(resolve, reject) => {
    try {
      Joi.validate(query, Joi.object().keys({
        hostname: Joi.string().required()
      }), {allowUnknown: true});

      const {hostname} = query;
      const {db, reducers} = this.props;
      await this.ShouldNotFound(hostname);
      await db.put(hostname, {hostname});
      await reducers.Location.batch({hostname, locations: {}, reset: true});
      // console.log('===========reducers===========');
      // console.log(reducers);
      resolve({hostname})
    } catch (e) {
      reject(e)
    }
  });

  Get = (hostname) => new Promise(async(resolve, reject) => {
    try {
      const {db} = this.props;
      const host = await db.get(hostname);
      // console.log('host: '+ JSON.stringify(host));
      resolve(host)
    } catch (e) {
      if (e.name == 'NotFoundError') return reject(new Error('HOST_NOT_FOUND'));
      reject(e)
    }
  });

  ShouldNotFound = (key) => new Promise(async(resolve, reject) => {
    try {
      const {db} = this.props;
      await db.get(key);
      reject(new Error('HOST_EXIST'));
    } catch (e) {
      if (e.name == 'NotFoundError') return resolve();
      reject(e)
    }
  });


  resolve = (req) => {
    const {action} = req;
    if (action == 'Get') return this.Get(req.hostname);
    if (action == 'New') return this.New(req);
    if (action == 'Delete') return this.Delete(req);
    if (action == 'list') return this.list(req);
    if (action == 'detail') return this.detail(req);
    return new Promise((resolve, reject) => reject(new Error('NOT_FOUND')))

  }
}

module.exports = Host;