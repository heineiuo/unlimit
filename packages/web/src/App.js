import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Body from '@react-web/body'
import Loader from '@react-web/async-loader'
import {injectAsyncReducer} from '@react-web/store'
import Title from './Title'
import ProfileDropDown from './ProfileDropDown'
import commonStyles from './commonStyles'
import { checkLogin } from './account'

const getTitle = () => Title;

class CheckLogin extends Component {

  componentWillMount = () => {
    const {account, checkLogin} = this.props;
    if (!account.loginChecked) checkLogin();
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            {props => (
              <Loader 
                {...props}
                load={cb => require.ensure([], 
                  require => cb(null, require('./home/Home').default)
                )}
                loadKey="home" 
              />
            )}
          </Route>
          <Route path="/account">
            {props => (
              <Loader 
                {...props}
                load={cb => require.ensure([], 
                  require => cb(null, require('./account/Account').default)
                )}
                loadKey="account" 
              />
            )}
          </Route>
          <Route path="/drive">
            {props => (
              <Loader 
                {...props}
                loadKey="drive" 
                load={cb => require.ensure([], 
                  require => cb(null, require('./drive/Drive').default)
                )}
              />
            )}
          </Route>
          <Route path="/oauth">
            {props => (
              <Loader 
                {...props}
                loadKey="oauth" 
                load={(callback) => {
                  SystemJS.import('@unlimit/oauth')
                    .then(Com => callback(null, Com))
                    .catch(e => callback(e))
                }} />
            )}
          </Route>
          <Route path="/admin">
            {props => (
              <Loader
                {...props}
                loadKey="admin" 
                renderError={e => {
                  console.error(e)
                  return <pre>{e.stack}</pre>
                }}
                load={cb => {
                  SystemJS.import('@unlimit/admin')
                    .then(admin => cb(null, admin))
                    .catch(e => cb(e));
                }}
              />
            )}
          </Route>
          <Route component={require('./NotFound').default}/>
        </Switch>
      </Router>
    )
  }
}

// background-image: linear-gradient(70deg, #4e93e8, #61e4c6);
const styles = StyleSheet.create({
  ...commonStyles
});

const ConnectCheckLogin = connect(
  (store) => ({
    account: store.account,
    postList: store.postList
  }),
  (dispatch) => bindActionCreators({
    checkLogin
  }, dispatch)
)(CheckLogin);

export {CheckLogin, ConnectCheckLogin}
export default ConnectCheckLogin;
