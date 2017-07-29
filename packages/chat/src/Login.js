
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {accountInit, login} from '../store/account'

class Login extends Component {


  componentDidMount() {
    document.addEventListener('keydown', this.handle, true)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handle, true)
  }

  state = {
    username: '',
    password: ''
  };

  login = () => {
    const {username, password} = this.state;
    this.props.login(username, password)
  };

  handle = e => {
    if (process.env.NODE_ENV == 'development') {
      if (e.key == 'Enter') {
        if (this.state.username === '' && this.state.password === '') {
          this.setState({username: '2519086000@qq.com'})
          this.setState({password: '123456'})
        }
        this.login()
      }
    }
  }

  render () {

    const {username, password} = this.state;
    const {login} = this.props;

    return (
      <div>
        <h4>请登录</h4>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => this.setState({username:  e.target.value})}/>
        <input
          type="text"
          value={password}
          onChange={(e) => this.setState({password:  e.target.value})}
          placeholder="密码" />
        <button onClick={this.login}>登录</button>
      </div>
    )
  }
}


export default module.exports = connect(
  (state) => ({
    routing: state.routing,
    ws: state.ws,
    account: state.account
  }),
  (dispatch) => bindActionCreators({
    login
  }, dispatch)
)(Login);