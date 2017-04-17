
const request = require('request');
var Datastore = require('nedb-promise');
const LevelLocation = require('.././drive');
const LevelHost = require('.././host');

var Location = module.exports = new Datastore({
  filename: `${process.cwd()}/data/Location.db`,
  autoload: true
})

var Host = module.exports = new Datastore({
  filename: `${process.cwd()}/data/Host.db`,
  autoload: true
})


const test = async () => {
  try {
    const hosts = await Host.cfind({}).limit(10000).exec();
    const hostsMap = {}
    await Promise.all(hosts.map(host => new Promise(async (resolve, reject) => {
      try {
        await LevelHost.statics.new({hostname: host.hostname});
        console.log(`${host.hostname} 成功`)
        hostsMap[host.hostname] = Object.assign({locations: {}}, host)
        resolve()
      } catch(e){
        console.log(e.stack||e)
        reject(e)
      }
    })))

    console.log(hosts.length);
    console.log(Object.keys(hostsMap).length);
    await testLevelHost();


    // const id2hostname = (id) => hosts.filter(host => host._id == id)[0]['hostname'];
    await Promise.all(hosts.map(host => new Promise(async (resolve, reject) => {
      try {
        const {hostname} = host
        const locations = await Location.cfind({host_id: host._id}).sort({sort: 1}).exec()
        locations.forEach(location => {
          const {pathname, cors, content, contentType, sort, type} = location;
          // console.log(`获取到${hostname}的路由${pathname}`)
          // console.log(`类型是${type}`)
          // console.log(`内容是${content}`)
          hostsMap[hostname].locations[pathname] = {
            pathname,
            cors,
            type,
            content,
            contentType,
            sort
          }
        });
        // console.log(hostsMap[hostname].locations)
        await LevelLocation.statics.batch({
          hostname: hostname,
          locations: hostsMap[hostname].locations
        })
        resolve()
      } catch(e){
        console.log(e.stack||e)
        reject(e)
      }
    })))


  } catch(e){
    console.log(e)
  }
}

const getAllHost = async () => {
  try {
    const hosts = await Host.find({limit: 10})
    console.log(hosts.length)

  } catch(e){
    console.log(e)
  }
}

const testLevelHost = async () => {
  try {
    const hosts = await LevelHost.statics.list()
    console.log(hosts.list.length)

  } catch(e){
    console.log(e)
  }
}

const getLocations = async (hostname) => {
  try {
    const location = await LevelLocation.statics.list({hostname})
    console.log(JSON.stringify(location))

  } catch(e){
    console.log(e)
  }
}

// test()
// getAllcHost()
// testLevelHost()
