import sift from 'sift'
import isPlainObject from 'lodash/isPlainObject'

class Cursor {
  constructor(db, filter){
    this.db = db;
    this._filter = filter
  }

  _limit = null
  _skip = 0

  _fixData = (data) => {
    const noop = () => {}
    data.value = {_id: data.key, data: data.value}
    db.put(data.key, data.value).then(noop).catch(noop)
  }

  isClosed = false

  toArray = () => {
    return this.exec()
  }

  limit = (number) => {
    if (!number instanceof Number) throw new TypeError('Limit must be a number')
    this._limit = number
    return this
  }

  skip = (number) => {
    if (!number instanceof Number) throw new TypeError('Skip must be a number')
    this._skip = number
    return this
  }

  count = () => new Promise(async (resolve, reject) => {
    try {
      resolve((await this.exec()).length)
    } catch(e){
      reject(e)
    }
  })

  exec = () => new Promise(async (resolve, reject) => {
    const validate = sift(this._filter)
    const result = []
    const rs = this.db.createReadStream({
    })
    .on('data', (data) => {
      if (!isPlainObject(data.value)) return this._fixData(data)
      if (validate(data.value)) {
        if (data.value._id !== data.key) data.value._id = data.key
        result.push(data.value)
        if (this._limit && result.length >= this._limit) {
          rs.destroy()
          this.isClosed = true
          resolve(result)
        }
      }
    })
    .on('error', (err) => {
      reject(err)
    })
    .on('close', () => {
      this.isClosed = true
    })
    .on('end', () => {
      resolve(result)
      this.db.close()
    })
  })
}

export default Cursor
