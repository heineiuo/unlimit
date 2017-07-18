import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Spin from 'react-spin'
import Logged from "./Logged"
import UnLogged from './Unlogged'
import Header from './AccountHeader'

class Check extends Component {

  static defaultProps = {
    account: {},
    checkLogin: () => {},
    getAuthCodeAndRedirect: () => {}
  };

  render (){
    const {loginChecked, logged} = this.props;

    return (
      <div>
        {
          !loginChecked? (
            <div>
              <Spin />
            </div>
          ): (
            <div>
              {
                logged ?
                  <Logged/> :
                  <UnLogged />
              }
            </div>
          )
        }
      </div>
    )
  }
}


export default connect(
  (store) => ({
    loginChecked: store.account.loginChecked,
    logged: store.account.logged,
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
    checkLogin: require('../actions/account/checkLogin'),
    sendVerifyCode: require('../actions/account/sendVerifyCode'),
    getAuthCodeAndRedirect: require('../actions/account/getAuthCodeAndRedirect')
  }, dispatch)
)(Check)
