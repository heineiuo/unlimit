import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'

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
    return this.props.children
  }
}

// background-image: linear-gradient(70deg, #4e93e8, #61e4c6);

module.exports = CheckLogin;