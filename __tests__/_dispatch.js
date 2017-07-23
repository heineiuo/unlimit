import { createDispatch } from 'action-creator'

export default createDispatch({
  driver,
  request: {
    headers: {
      session: {
        logged: true
      }
    }
  },
  response: {}
})
