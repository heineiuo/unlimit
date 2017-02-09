const Datastore = require('nedb-promise')

const Setting = new Datastore({
  filename: `${process.cwd()}/build/data/setting.db`,
  autoload: true
})

Setting.empty = () => {
  return new Promise(async (resolve, reject)=>{
    try {
      await Setting.remove({}, {multi: true})
      resolve()
    } catch(e) {
      reject(e)
    }
  })
}

export default Setting