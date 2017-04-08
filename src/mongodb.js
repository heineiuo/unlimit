import {MongoClient} from 'mongodb'
import getConfig from './config'


let isConnected = false;
let isReconnecting = false;
let db = null;

const connectPromise = (mongodbUrl) => {
  return MongoClient.connect(mongodbUrl, {
    poolSize: 10,
    reconnectInterval: 1000,
    reconnectTries: 1000
  })
}

const reconnect = async () => {
  isReconnecting = true;
  try {
    const {production: {mongodbUrl}} = await getConfig();
    db = await connectPromise(mongodbUrl)
    attach(db)
  } catch(e){
    setTimeout(reconnect, 3000)
  } finally {
    isReconnecting = false;
  }
}

const firstConnect = () => new Promise(async (resolve, reject) => {
  try {
    const {production: {mongodbUrl}} = await getConfig();
    db = await connectPromise(mongodbUrl)
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
    process.nextTick(reconnect)
  })
}


const getMongodb = (options={customError: 'LOST_CONNECTION_TO_MONGODB'}) => new Promise(async (resolve, reject) => {
  try {
    if (isConnected) return resolve(db)
    if (isReconnecting) return reject(options.customError)
    resolve(await firstConnect())
  } catch(e){
    console.error(e)
    reject(options.customError)
  }
})

export default getMongodb