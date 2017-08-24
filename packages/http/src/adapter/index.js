import { match, when } from 'match-when'

let db = null

export const getDb = () => new Promise(async (resolve, reject) => {
  try {
    const { DB_ADAPTER, MONGODB_URL } = process.env
    if (db) return resolve(db)
    db = await match(DB_ADAPTER, {
      [when()]: async () => {
        const mongodb = await import('./mongodb')
        return mongodb.default({
          mongodbUrl: MONGODB_URL
        })
      }
    })
    resolve(db)
  } catch(e){
    reject(e)
  }
})
