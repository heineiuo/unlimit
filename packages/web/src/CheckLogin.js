import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Body from '@react-web/body'
import AsyncComponent from './components/AsyncComponent'
import Title from './components/Title'
import ProfileDropDown from './components/ProfileDropDown'
import commonStyles from './components/styles'
import {injectAsyncReducer} from './store'

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
                  require.ensure([], (require) => callback(null, require('./Drive').default))
                }
              }>
                {(state, Master) => (
                  state < 2 ? null: <Master {...props}/>
                )}
              </AsyncComponent>
            )}
          </Route>
          <Route path="/oauth">
            {props => (
              <AsyncComponent 
                loadKey="oauth" 
                load={(callback) => {
                  SystemJS.import('@unlimit/oauth')
                    .then(Com => callback(null, Com))
                    .catch(e => callback(e))
                }}>
                {(state, Auth) => (
                  state < 2 ? null:
                    <Auth {...props}/>
                )}
              </AsyncComponent>
            )}
          </Route>
          <Route path="/admin">
            {(props) => (
              <AsyncComponent loadKey="admin" load={
                (callback) => {
                  SystemJS.import('@unlimit/admin').then(admin => {
                    callback(null, admin)
                  }).catch(e => {
                    console.log(e)
                    callback(e)
                  });
                }
              }>
                {(state, Console) => (
                  state < 2 ? null:
                    state === 3 ? <div>加载控制台出错</div>:
                      <Console {...props} getTitle={getTitle} injectAsyncReducer={injectAsyncReducer}/>
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
