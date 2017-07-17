import {Db} from '../src/db'

const db = new Db({
  presets: [],
  dbpath: `${process.cwd()}/data`,
  keyEncoding: 'utf8',
  valueEncoding: 'json'
});

const testDb = db.collection('test')

process.nextTick(async () => {
  try {
    const docs = await testDb.findOne({_id: 'e7823c00-69f7-11e7-a211-d52f09749e8d'})
    console.log(docs)
  } catch(e){
    console.log(e)
  }
  
})
