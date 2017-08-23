import { match, when } from 'match-when'

const defaultState = {
  
}

export default (state=defaultState, action) => match(action.type, {
  [when()]: state
})

export const session = ({token}) => (dispatch, getState) => new Promise((resolve, reject) => {
  
})

export const login = query => (dispatch, getState) => new Promise((resolve, reject) => {
  
})

export const logout = ({token}) => (dispatch, getState) => new Promise((resolve, reject) => {
  
})
