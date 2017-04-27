import {MongoClient} from 'mongodb'
import getConfig from './config'


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

const reconnect = async () => {
  console.log('mongodb reconnecting...')
  try {
    const {mongodbUrl} = await getConfig();
    db = await connectPromise(mongodbUrl)
    isConnected = true
    isConnecting = false
    console.log('mongodb reconnect success')
    attach(db)
  } catch(e){
    setTimeout(reconnect, 3000)
  }
}

const firstConnect = () => new Promise(async (resolve, reject) => {
  try {
    isConnecting = true;
    const {mongodbUrl} = await getConfig();
    db = await connectPromise(mongodbUrl)
    isConnected = true
    isConnecting = false
    attach(db)
    resolve(db)
  } catch(e){
    setTimeout(reconnect, 3000)
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


const getMongodb = (options={customError: 'LOST_CONNECTION_TO_MONGODB'}) => new Promise(async (resolve, reject) => {
  try {
    if (isConnected) return resolve(db)
    if (isConnecting) return reject(options.customError)
    resolve(await firstConnect())
  } catch(e){
    console.error(e)
    reject(options.customError)
  }
})

export default getMongodb
