import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {checkLogin} from '../store/account'
import AsyncDrive from './Drive/AsyncDrive'
import AsyncHome from './Home/AsyncHome'
import AsyncConsole from './AsyncConsole'
import AsyncAccount from './Account/AsyncAccount'
import AsyncAuth from './Auth/AsyncAuth'
import {injectAsyncReducer} from '../store'

// import Home from './Home/Home'
// import Drive from './Drive/Master'

class CheckLogin extends Component {

  componentWillMount = () => {
    const {account, checkLogin} = this.props;
    // console.log(account, checkLogin);
    if (!account.loginChecked) checkLogin();
  };

  componentWillUnmount = () => {
    console.error('CheckLogin will unmount!')
  };

  render () {

    return (
      <Router>
        <Switch>
          <Route exact path="/" render={AsyncHome} />
          <Route path="/drive" render={AsyncDrive} />
          <Route path="/auth" render={AsyncAuth} />
          <Route path="/account" render={AsyncAccount} />
          <Route path="/console" render={AsyncConsole} />
          <Route component={require('./NotFound')}/>
        </Switch>
      </Router>
    )
  }
}

// background-image: linear-gradient(70deg, #4e93e8, #61e4c6);

const ConnectCheckLogin = connect(
  (store) => ({
    account: store.account,
    postList: store.postList
  }),
  (dispatch) => bindActionCreators({
    checkLogin,
  }, dispatch)
)(CheckLogin);


export {CheckLogin, ConnectCheckLogin}
export default ConnectCheckLogin;