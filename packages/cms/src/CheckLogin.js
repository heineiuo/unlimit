import React, {Component} from 'react'
import Body from '@react-web/body'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {HashRouter, Switch, Route, Link} from 'react-router-dom'
import AsyncComponent from './components/AsyncComponent'
import {__SMILE_TEMPLATE_NAME} from './constants'

class CheckLogin extends Component {
  
  componentDidMount = () => {
    const {account, checkLogin} = this.props;
    // console.log(account, checkLogin);
    if (!account.loginChecked) checkLogin();
  };

  componentWillUnmount = () => {
    console.error('CheckLogin will unmount!')
  };


  load = (callback) => {
    SystemJS.import(__SMILE_TEMPLATE_NAME).then(Template => {
      callback(null, Template)
    }).catch(e => {
      callback(e)
    })
  }

  render () {
    const {checkLogin, login} = this.props;

    return (
      <AsyncComponent loadKey="home" load={this.load}>
        {(state, Site) => state < 2 ? null: <Site {...this.props} />}
      </AsyncComponent>
    )
  }
}

export default module.exports = connect(
  (store) => ({
    account: store.account,
    posts: store.posts
  }),
  (dispatch) => bindActionCreators({
    checkLogin: require('./actions/checkLogin').default,
    login: require('./actions/login').default,
  }, dispatch)
)(CheckLogin);
