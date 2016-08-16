import Table from 'cli-table2'
import config from '../util/config'
import Host from '../model/host'
import Location from '../model/location'

/**
 * 列出所有的host
 */
export const listhost = async () => {
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
export const listLocationByhost = async () => {
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
export const createHost = async () => {
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
export const deleteHost = async () => {
  try {
    const numDelete = await Host.remove({hostname: config.hostname}, {})
    console.log(`删除了${numDelete}条数据`)
  } catch(e){
    console.log('删除失败')
    console.log(e.stack||e)
  }
}

/**
 * 创建location
 */
export const createLocation = async () => {
  try {
    const table = new Table({
      head: ['#', 'locationId', 'pathname', 'type', 'sort','content']
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

    table.push([1, location._id, location.pathname, location.type, location.sort, location.content])
    console.log(table.toString())

  } catch(e){

    console.log(`执行失败`)
    console.log(e.stack||e)
  }
}

/**
 * 更新location
 */
export const updateLocation = async () => {
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
    console.log(e.stack||e)
  }
}

export const deleteLocation = async () => {
  try {
    const numDelete = await Location.remove({_id: config.id}, {})
    console.log(`删除了${numDelete}条数据`)
  } catch(e){
    console.log('删除失败')
    console.log(e.stack||e)
  }
}

export const help = () => {
  const table = new Table({
    head: ['command', 'params', 'description']
  })

  table.push(['help', '', 'show commands'])
  table.push(['listhost', '', 'list all hosts'])
  table.push(['listLocationByHost', 'hostname', 'list all location of one host'])
  table.push(['createHost', 'hostname', 'create a host'])
  table.push(['createLocation', 'hostname, pathname, type, sort, content', 'create a location'])
  table.push(['deleteHost', 'hostname', 'delete a host'])
  table.push(['updateLocation', 'id, pathname, type, sort, content', 'update a location'])
  table.push(['deleteLocation', 'id', 'delete a location'])

  console.log(table.toString())
}
