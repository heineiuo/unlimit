const Datastore = require('nedb-promise')

const Host = module.exports = new Datastore({
  filename: `${process.cwd()}/data/Host.db`,
  autoload: true
})

Host.createHost = () => {
  return new Promise(async (resolve, reject) => {

    try {
      /**
       * 先检查有没有host
       */
      const hasExist = await Host.findOne({hostname: config.hostname})
      if (hasExist) {
        console.log('已经存在该host')
      } else {
        await Host.insert({hostname: config.hostname})
      }

    } catch(e){
      next(e)
    }

  })
}