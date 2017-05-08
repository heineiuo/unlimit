import Admin from './Admin'
import admin from '../reducers/admin'

export default module.exports = ({injectAsyncReducer}) => {
  injectAsyncReducer('admin', admin);

  return Admin
}
