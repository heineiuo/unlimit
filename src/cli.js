import Table from 'cli-table2'
import config from './util/config'
import Host from './model/host'
import Location from './model/location'

/**
 * 列出所有的host
 */
const listhost = async () => {
  const table = new Table({
    head: ['#', 'id', 'host']
  })
  const list = await Host.find({})
  list.forEach((item, index) => {
    table.push([index+1, item._id, item.hostname])
  })
  console.log(table.toString())
}

/**
 * 列出某个host的所有location
 */
const listLocationByhost = async () => {
  const table = new Table({
    head: ['#', 'locationId', 'sort', 'pathname', 'type', 'content']
  })
  const host = await Host.findOne({hostname: config.hostname})
  if (!host) return console.log('没有找到这个域名')
  const locations = await Location.cfind({host_id: host._id}).sort({sort: 1}).exec()
  locations.forEach((item, index)=>{
    table.push([index+1, item._id,  `${item.sort}(${typeof item.sort})`, item.pathname, item.type, item.content])
  })
  console.log(table.toString())
}

/**
 * 创建host
 */
const createHost = async () => {
  const table = new Table({
    head: ['#', 'id', 'host']
  })

  /**
   * 先检查有没有host
   */
  const hasExist = await Host.findOne({hostname: config.hostname})
  if (hasExist) {
    console.log('已经存在该host')
  } else {
    await Host.insert({hostname: config.hostname})
  }

  const host = await Host.findOne({hostname: config.hostname})
  table.push([1, host._id, host.hostname])

  console.log(table.toString())

}

/**
 * 删除host
 */
const deleteHost = async () => {
  try {
    const numDelete = await Host.remove({hostname: config.hostname}, {})
    console.log(`删除了${numDelete}条数据`)
  } catch(e){
    console.log('删除失败')
    console.log(e)
  }
}

/**
 * 创建location
 */
const createLocation = async () => {
  try {
    const table = new Table({
      head: ['#', 'locationId', 'pathname', 'sort','content']
    })

    const host = await Host.findOne({hostname: config.hostname})
    if (!host) throw '没有找到这个域名'

    const location = await Location.insert({
      host_id: host._id,
      pathname: config.pathname,
      type: config.type,
      content: config.content,
      sort: config.sort
    })

    table.push([1, location._id, location.pathname, location.sort, location.content])
    console.log(table.toString())

  } catch(e){

    console.log(`执行失败`)
    console.log(e)
  }
}

/**
 * 更新location
 */
const updateLocation = async () => {
  try {
    const table = new Table({
      head: ['#', 'locationId', 'pathname', 'sort','content']
    })

    const nowLocation = await Location.findOne({_id: config.id})
    if (!nowLocation) throw '没有该Location'

    const nextLocation = {}

    if (config.hasOwnProperty('type')) nextLocation.type = config.type
    if (config.hasOwnProperty('pathname')) nextLocation.pathname = config.pathname
    if (config.hasOwnProperty('content')) nextLocation.content = config.content
    if (config.hasOwnProperty('sort')) nextLocation.sort = Number(config.sort)

    const result = await Location.update({_id: config.id}, {
      $set: nextLocation
    }, {
      returnUpdatedDocs: true
    })

    table.push([1, result._id, result.pathname, `${result.sort}(${typeof result.sort})`, result.content])
    console.log(table.toString())

  } catch(e){
    console.log(`执行失败`)
    console.log(e)
  }
}

const deleteLocation = async () => {
  try {
    const numDelete = await Location.remove({_id: config.id}, {})
    console.log(`删除了${numDelete}条数据`)
  } catch(e){
    console.log('删除失败')
    console.log(e)
  }
}

const start = () => {

  if (config.listhost) return listhost()
  if (config.listLocationByHost) return listLocationByhost()
  if (config.createHost) return createHost()
  if (config.createLocation) return createLocation()
  if (config.deleteHost) return deleteHost()
  if (config.updateLocation) return updateLocation()
  if (config.deleteLocation) return deleteLocation()


}

start()