/**
 * Copyright heineiuo@gmail.com
 */

import {Model} from '../../utils/spruce'
import Joi from 'joi'
import awaitify from '../../utils/awaitify'
import Location from '../location'

const Host = new Model('Host', {});

Host.Get = (key) => new Promise(async(resolve, reject) => {
  try {
    resolve(await Host.get(key))
  }catch(e){
    if (e.name == 'NotFoundError') return reject('HOST_NOT_FOUND');
    reject(e)
  }
});

Host.ShouldNotFound = (key) => new Promise(async(resolve, reject) => {
  try {
    await Host.get(key);
    reject('HOST_EXIST');
  }catch(e){
    if (e.name == 'NotFoundError') return resolve();
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
Host.statics.new = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    const {hostname} = query;
    await Host.ShouldNotFound(hostname);
    await Host.put(hostname, {hostname});
    await Location.put(hostname, {locations: {}});
    resolve({hostname})
  } catch(e){
    reject(e)
  }
});

/**
 * @api {POST} /host/list 获取域名列表
 * @apiGroup Host
 * @apiName HostList
 * @apiSuccess {string} list
 */
Host.statics.list = (query, ctx) => new Promise(async(resolve, reject) => {
  try {
    const list = await Host.find({});
    resolve({list});
  } catch(e){
    reject(e)
  }
});


/**
 * @api {POST} /Host/delete删除host
 * @apiGroup Host
 * @apiName HostDelete
 * @apiParam {string} hostname
 */
Host.statics.delete = (query) => new Promise(async (resolve, reject) => {
  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    const {hostname} = query;
    await Promise.all([
      Host.del(hostname),
      Location.del(hostname)
    ]);
    resolve({})
  } catch(e){
    reject(e)
  }
});


/**
 * @api {POST} /Host/detail 获取域名详情
 * @apiGroup Host
 * @apiName HostDetail
 * @apiParam {string} hostname
 * @apiSuccess {object} host
 */
Host.statics.detail = (query, ctx)  => new Promise(async(resolve, reject) => {
  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    const {hostname} = query
    const host = await Host.Get(hostname);
    resolve({host})
  } catch(e){
    reject(e)
  }
});


export default module.exports = Host