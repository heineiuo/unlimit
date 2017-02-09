import argv from './argv'
const Datastore = require('nedb-promise')


const importSchemaAndData = async (table_name) => {
  try {

    const db = module.exports = new Datastore({
      filename: `${process.cwd()}/build/data/${table_name}.db`,
      autoload: true
    })

    await db.remove({}, {multi: true})

    const raw = require(`${process.cwd}${argv.raw}`)
    const promises = raw[table_name].docs.map(item => {
      return new Promise(async (resolve, reject)=> {
        try {
          const insertData = {}
          raw[table_name].schema.forEach((key, index)=>{
            insertData[key] = item[index]
          })
          await db.insert(insertData)
          resolve()
        } catch(e){
          reject(e)
        }
      })
    })

    await Promise.all(promises)
    console.log('import data success!')

  } catch(e){
    console.error(e.stack)
  }
}

importSchemaAndData('posts')
importSchemaAndData('relation')
importSchemaAndData('terms')

