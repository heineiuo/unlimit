import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from '@react-web/spin'
import { match, when } from 'match-when'
import Logged from "./Logged"
import LoginByEmail from './LoginByEmail'
import Login from './Login'
import { checkLogin, sendVerifyCode, getAuthCodeAndRedirect } from './'

class Check extends Component {

  static defaultProps = {
    account: {},
    checkLogin: () => {},
    getAuthCodeAndRedirect: () => {}
  }

  render (){
    const {loginChecked, logged} = this.props
    return (
      <div>
        {match(loginChecked, {
          [when(false)]: () => <Spin />,
          [when()]: () => 
            match(logged, {
              [when(true)]: () => <Logged />,
              [when()]: () => <Login />
            })
        })}
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
    checkLogin, 
    sendVerifyCode, 
    getAuthCodeAndRedirect
  }, dispatch)
)(Check)
