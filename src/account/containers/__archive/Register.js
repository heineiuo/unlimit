import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {StyleSheet, css} from 'aphrodite/no-important'
import * as SDK from '../../sdk/account'
import {inputStyle, buttonStyle} from '../common/inlinestyles'
import Input from '../../components/Input'
import Button from '../../components/Button'
import styles from '../common/styles'

class RegisterView extends Component {

  static defaultProps = {
    account: {},
    actions: {
      checkLogin: () => {},
      getAuthCodeAndRedirect: () => {}
    },
  };


  handleKeyPress = (e) => {
    const {actions} = this.props
    if (e.key == 'Enter') {
      console.log('Enter');
      actions.sendVerifyCode()
    }
  };

  register = () => {
    console.log('handle submit');
    const {register, type, actions} = this.props;
    const {email, phone, password, code} = this.state;
    if (this.state.type == 'phone') {
      if (phone && phone.length == 11) {
        actions.register({phone, password, code})
      } else {
        this.setState({registerError: '手机号码格式不正确'})
      }
    } else if (this.state.type == 'email') {
      actions.register({email, password, code})
    }

  };

  sendVerifyCode = () => {
    const {actions} = this.props;
    const {phone, email} = this.state;
    if (this.state.type == 'phone') {
      if (phone && phone.length==11) {
        actions.sendVerifyCode({phone})
      }
    } else if (this.state.type == 'email') {
      actions.sendVerifyCode({email})
    }
  };


  state = {
    tab: 'phone',
    registerError: ''
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(Object.assign({}, this.state, nextProps))
  };

  render (){

    const {tab} = this.state;
    const {account, actions, switchPane} = this.props;

    const codeInputStyle = Object.assign({}, inputStyle, {
      width: '174px',
      overflow: 'hidden',
      marginRight: '2px',
      float: 'left'
    });

    const inputCodeBarStyle = {
      height: '44px',
      marginBottom: '2px'
    };

    const sendCodeStyle = Object.assign({}, buttonStyle, {
      width: '120px',
      float: 'left',
      marginTop: 0
    });

    return (
      <div className={css(styles.card)}>
        <div className={css(styles.logo)}>
          Smile
        </div>
        <div className={css(styles.tabbar)}>
          <div
            className={css(styles.tab, tab=='phone' && styles['tab--active'])}
            onClick={()=>{this.setState({tab: 'phone'})}}>手机注册</div>
          <div
            className={css(styles.tab, tab=='email' && styles['tab--active'])}
            onClick={()=>{this.setState({tab: 'email'})}}>邮箱注册</div>
        </div>
        <div>
          <div>
            {{
              phone: <Input
                style={inputStyle}
                type="text"
                value={this.state.phone}
                onChange={(e)=>this.setState({phone: e.target.value})}
                placeholder="手机号" />,
              email: <Input
                style={inputStyle}
                type="text"
                value={this.state.email}
                onChange={(e)=>this.setState({email: e.target.value})}
                placeholder="邮箱" />
            }[tab]}
            <div style={inputCodeBarStyle}>
              <Input
                type="text"
                value={this.state.code}
                style={codeInputStyle}
                onChange={(e)=>this.setState({code: e.target.value})}
                placeholder="验证码" />
              <Button
                style={sendCodeStyle}
                type={account.registerVerifyCodeCount>0?'secondary':'primary'}
                onClick={actions.sendVerifyCode}>
                {account.registerVerifyCodeCount>0?
                  `${account.registerVerifyCodeCount}s后可重发`:
                  '发送验证码'}
                </Button>
            </div>
            <Input
              style={inputStyle}
              type="password"
              value={this.state.password}
              onChange={(e)=>this.setState({password: e.target.value})}
              onKeyPress={this.handleKeyPress}
              placeholder="密码(6-20位字母或数字)"/>
            <div className={css(styles.errorMsg, account.registerError != '' && styles['errorMsg--show'])}>
              {account.registerError}
              </div>
            <Button style={buttonStyle} onClick={actions.register}>注册</Button>
          </div>
          <div className={css(styles.forgot)} onClick={() => switchPane({tab: 'login'})}>登录</div>
        </div>
      </div>
    )
  }
}


export default connect((state) => {
  return {
    account: state.account
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({

      register: (form) => async (dispatch, getState) => {
        try {
          const { password, code} = form
          const result = form.hasOwnProperty('phone')?
            await SDK.register(form.phone, password, code):
            await SDK.registerByEmail(form.email, password, code);
          if (result.error) {
            return dispatch({
              type: "REGISTER_ERROR",
              error: result.error
            })
          }
          localStorage.userId = result.user.userId;
          localStorage.token = result.userToken.token;
          dispatch({
            type: 'REGISTER_SUCCESS'
          })
        } catch(e){
          console.log(e)
        }
      },
      /**
       * 发送验证码
       * @param form
       * @returns {function()}
       */
      sendVerifyCode: (form) => async (dispatch, getState) => {
        try {
          const {registerVerifyCodeCount} = getState().account;
          if (registerVerifyCodeCount>0) return console.log('count not finish.');

          const result = form.hasOwnProperty('phone')?
            await SDK.sendVerifyCode(form.phone):
            await SDK.sendVerifyCodeEmail(form.email);
          if (result.error) throw result.error;

          const countdown = (count) => {
            dispatch({
              type: 'UPDATE_REGISTER_VERIFY_CODE_COUNT',
              count: count
            });
            if (count > 0){
              count --;
              setTimeout(()=>{countdown(count)}, 1000)
            }
          };
          countdown(60)
        } catch(error){
          console.log(error.stack||error)
        }
      }

    }, dispatch)
  }
})(RegisterView)