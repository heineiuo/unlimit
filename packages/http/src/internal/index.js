import { Container, Functions } from '@jql/server'
import isPlainObject from 'lodash/isPlainObject'
import * as auth from './auth'
import * as version from './version'
import * as functions from './functions'
import folder from '../response/folder'

export const internalLocations = [
  {
    "pathname": "*",
    // "cors": true,
    // "type": "FILE",
    "function": `async function(db){
      await db.actions.folder({rootDir: './'})
    }`
  }
]

export const internalActions = new Functions({
  internalFunctions: {
    session: auth.session,
    folder
  }
})


export const container = new Container({
  env: {
    Folder: folder
  }
})

export const middleware = (req, res, host, location) => new Promise(async (resolve, reject) => {
  try {
    const params = Object.assign({}, req.query, req.body)
    const __fn = `(${location.function})`
    const result = await container.exec({__fn}, {
      reducers: {
        version: version.default,
        auth: auth.default
      },
      actions: internalActions.all(),
      params,
      request: req, 
      response: res 
    })
    if (isPlainObject(result)) res.json(result)
    resolve()
  } catch(e){
    reject(e)
  }
})
