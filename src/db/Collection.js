import uuidv1 from 'uuid/v1'
import Cursor from './Cursor'

class Collection {
  constructor(db){
    this.db = db
  }

  /**
   * in leveldb, value is null will throw an error,
   * so this method return null like mongodb
   */
  _getEnsureSafe = (_id) => new Promise(async (resolve) => {
    try {
      resolve(await this.db.get(_id))
    } catch(e){
      resolve(null)
    }
  })

  findOne = (filter) => new Promise(async (resolve, reject) => {
    try {
      if (!!filter._id) {
        return resolve(await this._getEnsureSafe(filter._id))
      }
      const result = await this.find(filter).toArray()
      if (result.length === 0) return resolve(null)
      return resolve(result[0])
    } catch(e){
      reject(e)
    }
    
  })

  find = (filter, fields) => {
    return new Cursor(this.db, filter, fields)
  }

  findOneAndUpdate = (filter={}, update={$set: {}}, options={}) => new Promise(async (resolve, reject) => {
    try {
      if (!!filter._id) {
        const data = await this._getEnsureSafe(filter._id)
        const nextData = Object.assign({}, data, update.$set)
        await this.db.put(filter._id, nextData)
        return resolve(nextData)
      }

      const found = await this.find(filter).limit(1).toArray()
      if (found.length === 0) {
        if (options.upsert) {
          const result = await this.insertOne(update.$set)
          update._id = result._id
          return resolve(update)
        } else {
          return reject(new Error('Not found'))
        }
      }

      const doc = found[0]
      const nextDoc = Object.assign({}, doc, update.$set)
      await this.db.put(doc._id, nextDoc)
      return resolve(nextDoc)

    } catch(e){
      reject(e)
    }

  })

  findOneAndDelete = (filter) => new Promise(async (resolve) => {
    if (!!filter._id) {
      await this.db.del(filter._id)
      return resolve()
    }

    const result = this.find(filter).limit(1)
    if (!!result) {
      await this.db.del(result._id)
    }
    return resolve()
  })

  insertOne = (data) => {
    const _id = data._id || uuidv1()
    return this.db.put(_id, {...data, _id})
  }
}

export default Collection
