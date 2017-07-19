import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Body from 'react-sea/lib/Body'
import AsyncComponent from './components/AsyncComponent'
import Title from './components/Title'
import ProfileDropDown from './components/ProfileDropDown'
import commonStyles from './components/styles'

const getTitle = () => Title;

class CheckLogin extends Component {

  componentWillMount = () => {
    const {account, checkLogin} = this.props;
    if (!account.loginChecked) checkLogin();
  };

  render () {

    return (
      <Router>
        <Switch>
          <Route exact path="/">
            {props => (
              <AsyncComponent 
                load={callback => require.ensure([], require => callback(null, require('./Home/Home').default))}
                loadKey="home" >
                {(state, Com) => state < 2 ? null: <Com {...props}/>}
              </AsyncComponent>
            )}
          </Route>
          <Route path="/account" >
            {props => (
              <AsyncComponent 
                load={callback => require.ensure([], require => callback(null, require('./Account/Account').default))}
                loadKey="account" >
                {(state, Account) => state < 2 ? null: <Account {...props}/>}
              </AsyncComponent>
            )}
          </Route>
          <Route path="/drive">
            {(props) => (
              <AsyncComponent loadKey="drive" load={
                (callback) => {
                  require.ensure([], (require) => callback(null, require('./Drive/Drive').default))
                }
              }>
                {(state, Master) => (
                  state < 2 ? null: <Master {...props}/>
                )}
              </AsyncComponent>
            )}
          </Route>
          <Route path="/oauth/iframe">
            {props => (
              <AsyncComponent loadKey="oauth-iframe" load={(callback) => require.ensure([], (require) => callback(null, require('./OAuth/Iframe').default))}>
                {(state, Auth) => (
                  state < 2 ? null:
                    <Auth {...props}/>
                )}
              </AsyncComponent>
            )}
          </Route>
          <Route path="/oauth">
            {(props) => (
              <AsyncComponent loadKey="oauth" load={(callback) => require.ensure([], (require) => callback(null, require('./OAuth').default))}>
                {(state, Auth) => (
                  state < 2 ? null:
                    <Auth {...props}/>
                )}
              </AsyncComponent>
            )}
          </Route>
          <Route path="/console">
            {(props) => (
              <AsyncComponent loadKey="admin" load={
                (callback) => {
                  //callback(require('./Master'));
                  //require.ensure([], (require) => callback(require('./Master')))
                  SystemJS.import('drive-admin').then(admin => {
                    const Admin = admin({injectAsyncReducer});
                    callback(null, Admin)
                  }).catch(e => callback(e));
                }
              }>
                {(state, Console) => (
                  state < 2 ? null:
                    state === 3 ? <div>加载控制台出错</div>:
                      <Console {...props} getTitle={getTitle} />
                )}
              </AsyncComponent>
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
    checkLogin: require('./actions/account/checkLogin'),
  }, dispatch)
)(CheckLogin);


export {CheckLogin, ConnectCheckLogin}
export default ConnectCheckLogin;
