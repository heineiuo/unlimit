let db = null

export const getDb = () => new Promise(async (resolve, reject) => {
  try {
    const { DB_ADAPTER } = process.env
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
