import {
  Urlencode,
  GETJSON,
  PUTJSON,
  POSTRawJSON,
  DELETEJSON,
  POSTUrlencodeJSON
} from '../util/fetch'


const APIHOST = window.__APIHOST

// 获取accessToken
export const accessToken = ()=> {
  const url = `${APIHOST}/access-token`
  return POSTUrlencodeJSON(url, {})
}

// 删除host
export const deleteHost = (location)=>{
  const url = `${APIHOST}/host/delete`
  return POSTUrlencodeJSON(url, {
    location: location
  })
}
// host列表
export const getHostList = ()=> {
  const url = `${APIHOST}/host/list`
  return GETJSON(url)
}
// 新建 host
export const createHost = (data) => {
  const body = {
    hostname: data.hostName
  }
  const url = `${APIHOST}/host/new`
  return POSTUrlencodeJSON(url, body)
}

// 查看host详情
export const getHostDetail =(host_id)=>{
  const url = `${APIHOST}/host/detail`
  return GETJSON(url, {
    host_id: host_id
  })
}


// 删除location
export const deleteLocation = ()=>{
  const url = `${APIHOST}/location/delete`
}

// location 详情 GET
export const getLocationDetail = (host_id, location_id)=>{
  const url = `${APIHOST}/location/detail`
  return GETJSON(url, {
    host_id: host_id,
    location_id: location_id
  })
}

// 更新location POST
export const editLocation = (nextLocation)=>{
  const url = `${APIHOST}/location/edit`
  return POSTUrlencodeJSON(url,nextLocation)
}

// 更新location排序
export const editLocationSort = (location, targetIndex)=>{
  const url = `${APIHOST}/location/update-sort`
  return POSTUrlencodeJSON(url, {
    location: location,
    target_index: targetIndex
  })
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
export const createLocation = (location)=> {
  const url = `${APIHOST}/location/new`
  return POSTUrlencodeJSON(url, location)
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
  return new Promise((resolve, reject)=>{
    resolve({url: url})
  })
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