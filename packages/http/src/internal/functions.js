import { match, when } from 'match-when'

const defaultState = {
  
}


export default (state=defaultState, action) => match(action.type, {
  [when()]: state
})

export const putFunction = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  
})

export const delFunction = (query) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  
})
