
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import IntegrateApp from './IntegrateApp'

export default module.exports = connect(
  (state) => ({
    account: state.account,
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(IntegrateApp)
