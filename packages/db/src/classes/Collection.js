import uuidv1 from 'uuid/v1'
import Cursor from './Cursor'
import isPlainObject from 'lodash/isPlainObject'

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
        if (!isPlainObject(nextData)) return reject(new TypeError('Data must be plain object'))        
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
      if (!isPlainObject(nextDoc)) return reject(new TypeError('Data must be plain object'))
      await this.db.put(doc._id, nextDoc)
      return resolve(nextDoc)
    } catch(e){
      reject(e)
    }

  })

  findOneAndReplace = () => new Promise(async (resolve) => {
    try {
      resolve()
    } catch(e){
      reject(e)
    }
  })

  findOneAndDelete = (filter) => new Promise(async (resolve) => {
    let error = null
    try {
      const result = await this.find(filter).limit(1).exec()
      console.log(result)
      if (result.length > 0) {
        await this.db.del(result[0]._id)
      }

    } catch(e){
      error = e
    } finally {
      console.log(error)
      if (error) return resolve({error: error.message})
      resolve({message: 'success'})
    }

  })

  insertOne = (data) => new Promise(async (resolve, reject) => {
    try {
      const _id = data._id || uuidv1()
      const putData = {...data, _id}
      if (!isPlainObject(putData)) return reject(new TypeError('Data format must be plain json.'))
      await this.db.put(_id, putData)
      resolve(putData)
    } catch(e){
      reject(e)
    }
  })

  mapReduce = () => new Promise(async (resolve, reject) => {
    try {
      resolve([])
    } catch(e){
      reject(e)
    }
  })
}

export default Collection
