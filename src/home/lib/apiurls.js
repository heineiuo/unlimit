// api v0.0.0

var apiurl = {}

/**--------------PRIVATE API------------------------**/
// 获取accessToken
apiurl['accessToken'] = [1, 'POST', conf.api_home_url+'/access-token']

/**----------------OPEN API----------------------**/
// 新建APP
apiurl['app.new'] = [1, 'POST', conf.api_base_url+'/app/new']
// 更新APP
apiurl['app.edit'] = [1, 'POST', conf.api_base_url + '/app/edit']
// 删除APP
apiurl['app.delete'] = [1, 'POST', conf.api_base_url+'/app/delete']
// app信息
apiurl['app.detail'] = [1, 'POST', conf.api_base_url+'/app/detail']
// 获取app列表
apiurl['app.list'] = [1, 'POST', conf.api_base_url+'/app/list']

// cname列表
apiurl['cname.list'] =   [1, 'POST' , conf.api_base_url+'/cname/list']
// 新建CName
apiurl['cname.new'] = [1, 'POST', conf.api_base_url+'/cname/new']
// cname 详情
apiurl['cname.detail'] = [1, 'POST', conf.api_base_url+'/cname/detail']
// 更新cname
apiurl['cname.edit'] = [1, 'POST', conf.api_base_url+'/cname/edit']
// 删除Cname
apiurl['cname.delete'] = [1, 'POST', conf.api_base_url+'/cname/delete']


// host
// 列表
apiurl['host.list'] =   [1, 'POST' , conf.api_base_url+'/host/list']
// 新建
apiurl['host.new'] = [1, 'POST', conf.api_base_url+'/host/new']
// 删除
apiurl['host.delete'] = [1, 'POST', conf.api_base_url+'/host/delete']


// 获取个人信息
apiurl['profile'] = [1, 'POST', conf.api_base_url+'/user/profile']