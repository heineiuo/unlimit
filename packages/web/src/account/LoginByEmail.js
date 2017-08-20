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

class UnLogged extends Component {

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
      // getAuthCodeAndRedirect()
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
    email: '',
    code: '',
    registerError: ''
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') this.submit()
  }

  submit = () => {
    const {email,  code} = this.state
    this.props.login({email, code})
  }

  sendVerifyCode = () => {
    const {email} = this.state
    this.props.sendVerifyCode({email})
  }


  componentWillUnmount = () => {
    console.log('wtf, ')
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
          <div style={{textAlign: 'center', marginBottom: 20, letterSpacing: 4, color: '#666'}}>欢迎登陆右括号</div>
          <div>
            <div>
              <div style={{marginBottom: 10}}>
                <Input
                  style={commonStyles.input}
                  type="text"
                  value={this.state.email}
                  onChange={(e)=>this.setState({email: e.target.value})}
                  placeholder="邮箱" />
              </div>
              <div style={{height: '44px', marginBottom: '2px', position: 'relative'}}>
                <Input
                  type="text"
                  value={this.state.code}
                  style={styles.codeInputStyle._definition}
                  onKeyPress={this.handleKeyPress}
                  onChange={(e)=>this.setState({code: e.target.value})}
                  placeholder="验证码" />
                <Button
                  style={styles.sendCodeStyle._definition}
                  type={account.registerVerifyCodeCount>0?'secondary':'primary'}
                  onClick={this.sendVerifyCode}>
                  {account.registerVerifyCodeCount>0?
                    `${account.registerVerifyCodeCount}s后可重发`:
                    '发送验证码'}
                </Button>
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
)(UnLogged)
