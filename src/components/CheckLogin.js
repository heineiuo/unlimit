import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import {HashRouter, Switch, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import AsyncDrive from './Drive/AsyncDrive'
import AsyncHome from './Home/AsyncHome'
// import Home from './Home/AsyncHome'
import AsyncConsole from './AsyncConsole'
import AsyncAccount from './Account/AsyncAccount'
import AsyncOAuth from './OAuth/AsyncOAuth'
import {injectAsyncReducer} from '../store'
// import Home from './Home/Home'
// import Drive from './Drive/Master'

class CheckLogin extends Component {

  componentWillMount = () => {
    const {account, checkLogin} = this.props;
    // console.log(account, checkLogin);
    if (!account.loginChecked) checkLogin();
  };

  render () {

    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" render={AsyncHome} />
          <Route path="/drive" render={AsyncDrive} />
          <Route path="/oauth" render={AsyncOAuth} />
          <Route path="/account" render={AsyncAccount} />
          <Route path="/console" render={AsyncConsole} />
          <Route component={require('./NotFound')}/>
        </Switch>
      </HashRouter>
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
    checkLogin: require('../actions/account/checkLogin'),
  }, dispatch)
)(CheckLogin);


export {CheckLogin, ConnectCheckLogin}
export default ConnectCheckLogin;