import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite'
import Input from '@react-web/input'
import Button from '@react-web/button'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Body from '@react-web/body'
import commonStyles from '../common/styles'
import Logo from '../common/Logo'
import { login, sendVerifyCode } from './'

class Login extends Component {

  static defaultProps = {
    account: {},
    checkLogin: () => {},
    getAuthCodeAndRedirect: () => {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillUpdate = () => {
    const {account, getAuthCodeAndRedirect} = this.props
    if (account.logged && this.props.location.query.redirectTo > 0) {
      this.props.push(this.props.location.query.redirectTo)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const {account, location} = this.props
    if (nextProps.account.logged && location.query.redirectTo) {
      if (
        (!account.loginChecked && nextProps.account.loginChecked) ||
        !account.logged
      ) {
        window.location.href = location.query.redirectTo
      }
    }
  }

  state = {
    username: '',
    password: ''
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') this.submit()
  }

  submit = () => {
    const {username,  password} = this.state
    this.props.login({username, password})
  }

  render (){
    const {account} = this.props

    return (
      <div>
        <Body style={{
          margin: 0, 
          backgroundColor: '#fff',
          backgroundImage: '-webkit-repeating-radial-gradient(center center, #adbbc3, #e0e3e4 1px, transparent 1px, transparent 100%)',
          backgroundSize: '15px 15px'
        }} />
        <div className={css(styles.card)}>
          <div style={{height: 130}}>
            <Logo />
          </div>
          <div style={{textAlign: 'center', marginBottom: 20, letterSpacing: 4, color: '#666'}}>{`欢迎登陆${global.SITE_NAME||''}`}</div>
          <div>
            <div>
              <div style={{marginBottom: 10}}>
                <Input
                  style={commonStyles.input}
                  type="text"
                  value={this.state.username}
                  onChange={(e)=>this.setState({username: e.target.value})}
                  placeholder="用户名" />
              </div>
              <div style={{height: '44px', marginBottom: '2px', position: 'relative'}}>
                <Input
                  type="password"
                  value={this.state.password}
                  style={commonStyles.input}
                  onKeyPress={this.handleKeyPress}
                  onChange={(e)=>this.setState({password: e.target.value})}
                  placeholder="密码" />
              </div>
              <div className={css(styles.errorMsg, account.registerError !== '' && styles['errorMsg--show'])}>
                {account.registerError}
              </div>
              <Button style={styles.commitButton._definition} onClick={this.submit}>提交</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  ...commonStyles,
  card: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 480,
    height: 618,
    margin: '60px auto 0',
    padding: '70px 40px 30px 40px',
    fontSize: 14,
    borderRadius: 2,
  },

  codeInputStyle: {
    ...commonStyles.input,    
    width: '164px',
    overflow: 'hidden',
    marginRight: '2px',
    float: 'left'
  },

  sendCodeStyle: {
    ...commonStyles.button,
    width: '130px',
    fontSize: 14,
    position: 'absolute',
    right: 1,
    top: 1,
    height: 35,
    backgroundColor: '#FFF',
    color: '#666',
    marginTop: 0
  },

  commitButton: {
    ...commonStyles.button,
    backgroundColor: '#2a7be0',
  }

})


export default module.exports = connect(
  (store) => ({
    account: store.account,
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
    login,
    sendVerifyCode,
  }, dispatch)
)(Login)
