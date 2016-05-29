import {
  Urlencode,
  GETJSON,
  PUTJSON,
  POSTRawJSON,
  DELETEJSON,
  POSTUrlencodeJSON
} from '../util/fetch'


// const APIHOST = 'https://cloud.youkuohao.com/api'
const APIHOST = '/api'


/**--------------PRIVATE API------------------------**/

// 获取accessToken
export const accessToken = ()=> {
  const url = `${APIHOST}/access-token`
  return POSTUrlencodeJSON(url, {})
}

// 删除APP
export const appDelete =(app_id)=>{
  return POSTUrlencodeJSON(`${APIHOST}/app/delete`, {app_id: app_id})
}

// app信息
export const appDetail = (app_id)=>{
  return POSTUrlencodeJSON(`${APIHOST}/app/detail`)
}

// 更新APP
export const appEdit = (app_id)=> {
  return POSTUrlencodeJSON(`${APIHOST}/app/edit`)
}

// 获取app列表
export const appList = ()=> {
  return POSTUrlencodeJSON(`${APIHOST}/app/list`)
}

// 新建APP
export const createApp = ()=>{
  const url = `${APIHOST}/app/new`
}
// 删除location
export const deleteLocation = ()=>{
  const url = `${APIHOST}/location/delete`
}

// location 详情 GET
export const getLocationDetail = ()=>{
  const url = `${APIHOST}/location/detail`
}

// 更新location POST
export const editLocation = ()=>{
  const url = `${APIHOST}/location/edit`
}

// 更新location排序
export const editLocationSort = ()=>{
  const url = `${APIHOST}/location/update-sort`
}

// location列表
export const getLocationList = (host_id)=>{
  const url = `${APIHOST}/location/list`
  const query = {
    host_id: host_id
  }
  console.log(query)
  return GETJSON(url, query)
}

// 新建location
export const createLocation = ()=> {
  const url = `${APIHOST}/location/new`

}
// 删除host
export const deleteHost = ()=>{
  const url = `${APIHOST}/host/delete`

}
// host列表
export const getHostList = ()=> {
  const url = `${APIHOST}/host/list`
  return GETJSON(url)
}
// 新建 host
export const createHost = ()=> {
  const url = `${APIHOST}/host/new`
}

// 查看host详情
export const getHostDetail =()=>{
  const url = `${APIHOST}/host/detail`

}


/**
 * 登录
 */
export const loginByPassword = ()=> {
  const url = `${APIHOST}/login`

}

// 获取个人信息
// POST
export const getProfile =()=> {

  const url = `${APIHOST}/user/profile`
}

// POST
export const serverStatus =()=> {
  const url = `${APIHOST}/status`
}

/***********************
 *
 * 文件资源相关
 *
 **********************/

export const uploadImage = (body={}) => {
  const url = `${APIHOST}/upload`
  return POSTUrlencodeJSON(url, body)
}

export const deleteFile = (body) => {
  const url = `${APIHOST}/file/delete`
  return POSTUrlencodeJSON(url, body)
}


export const renameFile = (body)=> {
  const url = `${APIHOST}/file/rename`
  return POSTUrlencodeJSON(url, body)
}


export const getDownloadFileUrl = (path)=> {
  const url = `${APIHOST}/file/download?${Urlencode({path})}`
  return url
}

/**
 * 读取目录
 * @param path
 * @returns {*}
 */
export const readDir = (path)=>{
  const url = `${APIHOST}/file/readdir`
  const params = {path: path}
  return POSTUrlencodeJSON(url, params)
}