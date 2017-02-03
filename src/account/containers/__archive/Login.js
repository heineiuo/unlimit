import React, {Component} from 'react'
import {Link} from 'react-router'
import Login from '../../components/Login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {StyleSheet, css} from 'aphrodite/no-important'
import * as SDK from '../../sdk/account'
import Input from '../../components/Input'
import Button from '../../components/Button'
import {inputStyle, buttonStyle} from '../common/inlinestyles'
import styles from '../common/styles'

const {location, localStorage} = window;

class LoginView extends Component {

  static defaultProps = {
    handleSubmit: () => {}
  };

  handleKeyPress = (e) => {
    if (e.key == 'Enter') {
      console.log('Enter');
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const {phone, email, password} = this.state;
    this.props.handleSubmit(this.props.type, {phone, email, password})
  };

  state = {
    tab: 'email',
    phone: '',
    password: '',
    email: ''
  };

  render (){
    const {tab} = this.state;
    const {loginError, switchPane} = this.props;

    return (
      <div className={css(styles.card)}>
        <div className={css(styles.logo)}>
          右括号
        </div>
        <div className={css(styles.tabbar)}>
          {/*<div className={css(styles.tab, tab=='phone' && styles['tab--active'])}*/}
               {/*onClick={()=>{this.setState({tab: 'phone'})}}>手机登录</div>*/}
          <div className={css(styles.tab, tab=='email' && styles['tab--active'])}
               onClick={()=>{this.setState({tab: 'email'})}}>邮箱登录</div>
        </div>
        <div>
          <div>
            {{
              phone: <Input
                style={inputStyle}
                type="text"
                value={this.state.phone}
                onChange={(e)=>{this.setState({phone: e.target.value})}}
                placeholder="手机号" />,
              email: <Input
                style={inputStyle}
                type="text"
                value={this.state.email}
                onChange={(e)=>{this.setState({email: e.target.value})}}
                placeholder="邮箱" />
            }[tab]}
            <Input
              style={inputStyle}
              type="password"
              value={this.state.password}
              onChange={(e)=>{this.setState({password: e.target.value})}}
              onKeyPress={this.handleKeyPress}
              placeholder="密码(6-20位字母或数字)"/>
            <div className={css(styles.errorMsg, loginError && styles['errorMsg--show'])}>
              {loginError}
            </div>
            <Button style={buttonStyle} onClick={this.handleSubmit}>登录</Button>
          </div>

          <div className={css(styles.clearfix)}>
            <Link className={css(styles.forgot)} to="/forgot-password" >忘记密码</Link>
            <span className={css(styles.registerBtn)} onClick={() => switchPane('register')}>注册</span>
          </div>
        </div>
      </div>
    )
  }
}


export default connect(function (state) {
  return {
    account: state.account
  }
}, function (dispatch) {
  return {
    actions: bindActionCreators({
      
      login: (type, formData) => async (dispatch, getState) => {
        try {
          const result = type == 'phone'?
            await SDK.login(formData.phone, formData.password):
            await SDK.loginByEmail(formData.email, formData.password)

          if (result.error) {
            return dispatch({
              type: "LOGIN_ERROR",
              error: result.error
            })
          }

          localStorage.userId = result.userId
          localStorage.userToken = result.userToken

          dispatch({
            type: 'LOGIN_SUCCESS'
          })

        } catch(e){
          console.log(e)
        }
      }
    }, dispatch)
  }
})(LoginView)