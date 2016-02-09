var cookie = require('../lib/cookie')

var api = module.exports = {};

api.__base = '/api'
api.__autoData = function(){
  return {
    cname_token: cookie('cname_token').val(),
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
// 删除Cname
api['cname.delete'] = [1, 'POST', api.__base+'/cname/delete']
// cname 详情
api['cname.detail'] = [1, 'POST', api.__base+'/cname/detail']

// 更新cname
api['cname.edit'] = [1, 'POST', api.__base+'/cname/edit']
// cname列表
api['cname.list'] =   [1, 'POST' , api.__base+'/cname/list']

// 新建CName
api['cname.new'] = [1, 'POST', api.__base+'/cname/new']

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



















