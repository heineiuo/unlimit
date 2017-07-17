import {Db} from '../src/db'

const db = new Db({
  presets: [],
  dbpath: `${process.cwd()}/data`,
  keyEncoding: 'utf8',
  valueEncoding: 'json'
});

const testDb = db.collection('test')

testDb.insertOne({
  name: 'foo',
  description: 'bar'
}).then(async () => {

  const time = Date.now()
  let times = 0
  let total = 10000
  let docs
  
  while (times < total) {
    docs = await testDb.find({}).toArray()
    // console.log(docs)
    times ++
  }

  // await Promise.all(Array.from({length: total}).map(item => {
  //   return testDb.find({}).limit(1).toArray()
  // }))
  
  console.log(docs)
  const totalSpend = Date.now() - time
  console.log(
    `find ${total} times, 
    total spend: ${totalSpend}ms, 
    each spend ${totalSpend / total}ms`
  )
  
}).catch(e => {
  console.log(e)
})
