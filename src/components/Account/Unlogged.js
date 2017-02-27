import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite/no-important'
import {inputStyle, buttonStyle} from './common/inlinestyles'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import styles from './common/styles'
import {login, sendVerifyCode} from '../../store/account'


const codeInputStyle = Object.assign({}, inputStyle, {
  width: '164px',
  overflow: 'hidden',
  marginRight: '2px',
  float: 'left'
});

const inputCodeBarStyle = {
  height: '44px',
  marginBottom: '2px'
};

const sendCodeStyle = Object.assign({}, buttonStyle, {
  width: '130px',
  fontSize: 14,
  float: 'left',
  marginTop: 0
});

class UnLogged extends Component {

  static defaultProps = {
    account: {},
    checkLogin: () => {},
    getAuthCodeAndRedirect: () => {}
  };

  state = {
    email: '',
    code: '',
    registerError: ''
  };

  handleKeyPress = (e) => {
    if (e.key == 'Enter') this.submit()
  };

  submit = () => {
    const {login} = this.props;
    const {email,  code} = this.state;
    login({email, code})
  };

  sendVerifyCode = () => {
    const {sendVerifyCode} = this.props;
    const {email} = this.state;
    sendVerifyCode({email});
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(Object.assign({}, this.state, nextProps))
  };

  render (){
    const {tab} = this.state;
    const {account} = this.props;

    return (
      <div className={css(styles.card)}>
        <div className={css(styles.logo)}>
          右括号
        </div>
        {/*<div className={css(styles.tabbar)}>*/}
          {/*<div*/}
            {/*className={css(styles.tab, tab=='phone' && styles['tab--active'])}*/}
            {/*onClick={()=>{this.setState({tab: 'phone'})}}>手机注册</div>*/}
          {/*<div*/}
            {/*className={css(styles.tab, tab=='email' && styles['tab--active'])}*/}
            {/*onClick={()=>{this.setState({tab: 'email'})}}>邮箱注册</div>*/}
        {/*</div>*/}
        <div>
          <div>
            <Input
              style={inputStyle}
              type="text"
              value={this.state.email}
              onChange={(e)=>this.setState({email: e.target.value})}
              placeholder="邮箱" />
            <div style={inputCodeBarStyle}>
              <Input
                type="text"
                value={this.state.code}
                style={codeInputStyle}
                onKeyPress={this.handleKeyPress}
                onChange={(e)=>this.setState({code: e.target.value})}
                placeholder="验证码" />
              <Button
                style={sendCodeStyle}
                type={account.registerVerifyCodeCount>0?'secondary':'primary'}
                onClick={this.sendVerifyCode}>
                {account.registerVerifyCodeCount>0?
                  `${account.registerVerifyCodeCount}s后可重发`:
                  '发送验证码'}
              </Button>
            </div>
           {/* <Input
              style={inputStyle}
              type="password"
              value={this.state.password}
              onChange={(e)=>this.setState({password: e.target.value})}
              onKeyPress={this.handleKeyPress}
              placeholder="密码(6-20位字母或数字)"/>*/}
            <div className={css(styles.errorMsg, account.registerError != '' && styles['errorMsg--show'])}>
              {account.registerError}
            </div>
            <Button style={buttonStyle} onClick={this.submit}>提交</Button>
          </div>
          {/*<div className={css(styles.forgot)} onClick={() => switchPane({tab: 'login'})}>登录</div>*/}
        </div>
      </div>
    )
  }
}

export default UnLogged
