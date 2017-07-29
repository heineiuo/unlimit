import React, {Component} from 'react'
import Body from '@react-web/body'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {HashRouter, Switch, Route, Link} from 'react-router-dom'
const {__SMILE_TEMPLATE_NAME} = global
import { injectAsyncReducer } from '@react-web/store'
import Loader from '@react-web/async-loader'
import posts from './posts'
import account from './account'

injectAsyncReducer('account', account)
injectAsyncReducer('posts', posts)

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
      <Loader
        {...this.props}
        loadKey={__SMILE_TEMPLATE_NAME}
        load={this.load}
        renderError={(err) => <div>err</div>}
      />
    )
  }
}

export default module.exports = connect(
  (store) => ({
    account: store.account,
    posts: store.posts
  }),
  (dispatch) => bindActionCreators({
    getPostList: require('./getPostList').default,
    queryPostDetail: require('./queryPostDetail').default,
    checkLogin: require('./checkLogin').default,
    login: require('./login').default,
  }, dispatch)
)(CheckLogin);
