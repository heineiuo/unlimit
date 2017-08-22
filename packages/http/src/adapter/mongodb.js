import {MongoClient} from 'mongodb'

let isConnected = false;
let isConnecting = false;
let db = null;

const connectPromise = (mongodbUrl) => {
  return MongoClient.connect(mongodbUrl, {
    poolSize: 10,
    reconnectInterval: 1000,
    reconnectTries: 1000
  })
}

const reconnect = async (mongodbUrl) => {
  console.log('mongodb reconnecting...')
  try {
    db = await connectPromise(mongodbUrl)
    isConnected = true
    isConnecting = false
    console.log('mongodb reconnect success')
    attach(db)
  } catch(e){
    setTimeout(() => reconnect(mongodbUrl), 3000)
  }
}

const firstConnect = (mongodbUrl) => new Promise(async (resolve, reject) => {
  try {
    isConnecting = true;
    db = await connectPromise(mongodbUrl)
    isConnected = true
    isConnecting = false
    attach(db)
    resolve(db)
  } catch(e){
    setTimeout(() => reconnect(mongodbUrl), 3000)
    reject(e)
  }
})

const attach = (db) => {
  db.on('error', (e) => {
    console.log(e)
  })
  db.once('close', () => {
    console.log('mongodb close')
    db.removeAllListeners();
    isConnected = false;
    isConnecting = true;
    process.nextTick(reconnect)
  })
}


export default (options={customError: 'LOST_CONNECTION_TO_MONGODB'}) => new Promise(async (resolve, reject) => {
  try {
    if (isConnected) return resolve(db)
    if (isConnecting) return reject(options.customError)
    const { mongodbUrl } = options
    resolve(await firstConnect(mongodbUrl))
  } catch(e){
    console.error(e)
    reject(options.customError)
  }
})
