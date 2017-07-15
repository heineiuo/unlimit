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
      resolve(this.db.get(_id))
    } catch(e){
      resolve(null)
    }
  })

  findOne = (filter) => new Promise(async (resolve, reject) => {
    if (filter.hasOwnProperty(_id)) {
      return this._getEnsureSafe(_id)
    }
  })

  find = (filter) => {
    return new Cursor(this.db, filter)
  }

  findOneAndUpdate = () => new Promise(async (resolve, reject) => {

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
