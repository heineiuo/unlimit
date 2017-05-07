import Admin from './components/Admin'
import admin from './store/admin'

export default module.exports = ({injectAsyncReducer}) => {
  injectAsyncReducer('admin', admin);

  return Admin
}