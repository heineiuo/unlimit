import App from './App'
import topic from '../reducers/topic'

export default module.exports = ({injectAsyncReducer}) => {
  injectAsyncReducer('topic', topic)
  return App
}
