import { match, when } from 'match-when'

const defaultState = {

}


export default (state=defaultState, action) => match(action.type, {
  [when()]: state
})
