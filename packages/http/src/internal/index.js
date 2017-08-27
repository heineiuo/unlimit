// import { Container } from '@jql/server'
import { Container } from '../jql'
import isPlainObject from 'lodash/isPlainObject'
import { match, when } from 'match-when'
import * as auth from './auth'
import * as version from './version'
import * as functions from './functions'
import folder from '../response/folder'

/**
 * immutatable
 */
export const locations = [
  {
    pathname: "/jql",
    type: 'JQL'
  },
  {
    "pathname": "*",
    "function": `async function(db){
      try {
        return await db.folder({rootDir: './'}).a
        
      } catch(e){
        return e
      }
    }`
  }
]

export const container = new Container({
  reducers: {
    version: version.default,
    auth: auth.default
  },

  /**
   * immutatable
   */
  actions: {
    session: auth.session,
    login: auth.login,
    folder,
    getFunctions: () => container.maps
  }
})
