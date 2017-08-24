import { Container, Functions } from '@jql/server'
import isPlainObject from 'lodash/isPlainObject'
import { match, when } from 'match-when'
import * as auth from './auth'
import * as version from './version'
import * as functions from './functions'
import folder from '../response/folder'

export const internalLocations = [
  {
    pathname: "/jql",
    type: 'JQL'
  },
  {
    "pathname": "*",
    "function": `async function(db){
      await db.actions.folder({rootDir: './'})
    }`
  }
]

export const internalActions = new Functions({
  internalFunctions: {
    session: auth.session,
    login: auth.login,
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
    const reqBody = Object.assign({}, req.query, req.body)
    const { params, __fn} = match(location.type, {
      [when('JQL')]: () => {
        if (!reqBody.__fn) {
          res.status(403)
          const error = new Error('Params illegal')
          error.name = 'ForbiddenError'
          return reject(error)
        }
        return {
          params: reqBody.params || {},
          __fn: `(${reqBody.__fn})`
        }
      },
      [when()]: () => {
        return {
          params: reqBody,
          __fn: `(${location.function})`
        }
      }
    })
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
    if (isPlainObject(result)) {
      res.json(result)
    } else if (typeof result === 'number') {
      res.json(result)
    } else if (typeof result === 'string') {
      res.json(result)
    }
    resolve()
  } catch(e){
    reject(e)
  }
})
