import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import {Switch, Route, Redirect} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Body from 'react-sea/lib/Body'
import Background from 'react-sea/lib/Background'
import {injectAsyncReducer} from '../store'
import AsyncComponent from '../components/AsyncComponent'
import Sider from './Sider'

class Manage extends Component {

  render () {
    const {account, match, driveId} = this.props;
    const showLoading = !account.loginChecked;
    const showLogin = !showLoading && account.logged;
    const showUnLogin = !showLoading && !account.logged;

    return (
      <div style={{display: "flex"}}>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />
        <Background bgColor="#efeff4" />
        <Sider show={showLogin} match={match} />
        <div className={css(styles.wrapper)}>
          <Switch>
            <Route path={`${match.path}/`} exact>
              {props => (
                <AsyncComponent loadKey="home" load={callback => require.ensure([], require => callback(null, require('./Home').default))}>
                  {(state, Home) => state < 2 ? null : <Home {...props}/>}
                </AsyncComponent>
              )}
            </Route>
            <Route path={`${match.path}/posts`}>
              {props => (
                <AsyncComponent loadKey="employer" load={callback => require.ensure([], require => callback(null, require('./Posts').default))}>
                  {(state, Home) => state < 2 ? null : <Home {...props}/>}
                </AsyncComponent>
              )}
            </Route>
            <Route path={`${match.path}/settings`} ></Route>
            <Redirect to='/404' />
          </Switch>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    minHeight: window.innerHeight,
  }
})

export default connect(
  (store) => ({
    account: store.account,
    posts: store.posts
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Manage);
