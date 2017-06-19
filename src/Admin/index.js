import Admin from './Admin'
import admin from '../actions/admin'

export default module.exports = ({injectAsyncReducer}) => {
  injectAsyncReducer('admin', admin);

  return Admin
}
