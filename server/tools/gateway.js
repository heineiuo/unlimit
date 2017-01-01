import Table from 'cli-table2'
import config from '../utils/config'
import Host from '../integration/gateway/host'
import Location from '../integration/gateway/location'

/**
 * 列出所有的host
 */
export const listhost = () => new Promise(async (resolve, reject) => {
  try {
    const table = new Table({
      head: ['#', 'hostname']
    });
    const list = await Host.find({});
    list.forEach((item, index) => {
      table.push([index+1, item.hostname])
    });
    console.log(table.toString());
    resolve()
  } catch(e){
    reject(e)
  }

});

/**
 * 列出某个host的所有location
 */
export const listLocationByhost = () => new Promise(async (resolve, reject) => {
  try {
    const table = new Table({
      head: ['#',  'sort', 'pathname', 'type', 'contentType', 'content']
    });
    const host = await Host.Get(config.hostname);
    if (!host) return console.log('没有找到这个域名');
    const {locations} = await Location.get(config.hostname);
    Object.values(locations).sort((a,b) => a.sort>b.sort).forEach((item, index)=>{
      table.push([
        index+1,
        item.sort,
        item.pathname,
        item.type,
        item.contentType,
        item.content
      ])
    });
    console.log(table.toString())
  } catch(e){
    console.log(e.stack||e)
    reject(e)
  }
});

/**
 * 创建host
 */
export const createHost = () => new Promise(async (resolve, reject) => {
  try {
    const table = new Table({
      head: ['#', 'hostname']
    })

    /**
     * 先检查有没有host
     */
    const {hostname} = config;
    await Host.ShouldNotFound(hostname);
    await Host.put(hostname, {hostname});
    await Location.put(hostname, {locations: {}});
    table.push([1, hostname])
    console.log(table.toString())
    resolve()

  } catch(e){
    reject(e)
  }
});

/**
 * 删除host
 */
export const deleteHost = () => new Promise(async (resolve, reject) => {
  try {
    const {hostname} = config;
    await Host.statics.delete({hostname});
    console.log(`删除${hostname}成功`)
    resolve()
  } catch(e){
    console.log('删除失败')
    console.log(e.stack||e)
    reject(e)
  }
})

/**
 * 创建location
 */
export const createLocation =  () =>new Promise(async (resolve, reject) => {
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
    resolve()

  } catch(e){

    console.log(`执行失败`)
    console.log(e.stack||e)
    reject(e)
  }
})

/**
 * 更新location
 */
export const updateLocation = () =>new Promise(async (resolve, reject) => {
  try {
    const table = new Table({
      head: ['#', 'hostname', 'pathname', 'sort','content', 'cors', 'contentType', 'type']
    });
    const {nextLocation} = await Location.statics.edit(config);
    table.push([
      1,
      config.hostname,
      nextLocation.pathname,
      nextLocation.sort,
      nextLocation.content,
      nextLocation.cors,
      nextLocation.contentType,
      nextLocation.type
    ])
    console.log(table.toString())
    resolve()
  } catch(e){
    console.log(`执行失败`)
    console.log(e.stack||e)
    reject(e)
  }
})

export const deleteLocation = () => new Promise( async (resolve, reject) => {
  try {
    const numDelete = await Location.remove({_id: config.id}, {})
    console.log(`删除了${numDelete}条数据`)
    resolve()
  } catch(e){
    console.log('删除失败')
    console.log(e.stack||e)
    reject(e)
  }
})

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
};

export const init = async () => {
  try {
    await Host.put('localhost', {});
    await Location.put('localhost', {
      locations: {
        '/^.*$/': {
          pathname: '/^.*$/',
          cors: true,
          type: 'SEASHELL',
          sort: 1,
          contentType: '',
          content: 'SEASHELL'
        }
      }
    })
  } catch(e){
    console.log(e.stack||e)
  }
};


;(async () => {
  try {
    if (config.help) return help();
    if (config.listhost) return await listhost();
    if (config.listLocationByHost) return await listLocationByhost();
    if (config.createHost) return await createHost();
    if (config.createLocation) return await createLocation();
    if (config.deleteHost) return await deleteHost();
    if (config.updateLocation) return await updateLocation();
    if (config.deleteLocation) return await deleteLocation();

    process.exit(0);
  } catch(e){
    console.log(e.name)
    console.log(e.stack||e)
    if (e.name == 'TypeError') {
      console.log('请关闭服务进程再试')
    } else {
      console.log('异常错误')
    }
    process.exit(0)
  }
})();

process.on('error', console.log)
process.on('exit', (code) => {
  if (code != 0) console.log('异常退出')
})
