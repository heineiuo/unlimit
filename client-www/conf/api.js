var cookie = require('../lib/cookie')

var api = module.exports = {};

api.__base = '/api'
api.__autoData = function(){
  return {
    access_token: cookie('access_token').val(),
    debug: 'stack'
  }
}

api.__development = false
if (api.__development) api.__mock = require('./apiMock')

/**--------------PRIVATE API------------------------**/
// 获取accessToken
api['accessToken'] = [1, 'POST', api.__base+'/access-token']
// 删除APP
api['app.delete'] = [1, 'POST', api.__base+'/app/delete']
// app信息
api['app.detail'] = [1, 'POST', api.__base+'/app/detail']
// 更新APP
api['app.edit'] = [1, 'POST', api.__base + '/app/edit']
// 获取app列表
api['app.list'] = [1, 'POST', api.__base+'/app/list']

/**----------------OPEN API----------------------**/
// 新建APP
api['app.new'] = [1, 'POST', api.__base+'/app/new']
// 删除location
api['location.delete'] = [1, 'POST', api.__base+'/location/delete']
// location 详情
api['location.detail'] = [1, 'POST', api.__base+'/location/detail']

// 更新location
api['location.edit'] = [1, 'POST', api.__base+'/location/edit']
// location列表
api['location.list'] =   [1, 'POST' , api.__base+'/location/list']
// 新建location
api['location.new'] = [1, 'POST', api.__base+'/location/new']
// 删除
api['host.delete'] = [1, 'POST', api.__base+'/host/delete']
// host
// 列表
api['host.list'] =   [1, 'POST' , api.__base+'/host/list']
// 新建
api['host.new'] = [1, 'POST', api.__base+'/host/new']
api.hostDelete =   [1, 'POST' , api.__base+'/host/delete']
api.hostDetail =   [1, 'POST' , api.__base+'/host/detail']
api.install = [1, 'POST', api.__base+'/install']



/**
 *
 */
api.login = [1, 'POST', api.__base+'/login']



// 获取个人信息
api['profile'] = [1, 'POST', api.__base+'/user/profile']

api.serverStatus = [1, 'POST', api.__base+'/status']


/***********************
 *
 * 文件资源相关
 *
 **********************/
api.uploadImage = [1, 'POST', api.__base+'/upload']
api.readdir = [1, 'POST', api.__base+'/file/readdir']
api.deleteFile = [1, 'POST', api.__base+'/file/delete']
api.renameFile = [1, 'POST', api.__base+'/file/rename']
api.downloadFile = [1, 'GET', api.__base+'/file/download']



















