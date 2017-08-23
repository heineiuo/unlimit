import versionReducer, { log, index } from './version'

export const reducers = {
  version: versionReducer
}

export const actions = {
  '/': version['/'],
  account: require('./account').default,
  fs: require('./fs').default,
  drive: require('./drive').default,
  version
}

export const locations = [
  {
    "pathname": "*",
    // "cors": true,
    // "type": "FILE",
    "function": `async (db) => {
      return db.Folder()
    }`
  }
]
