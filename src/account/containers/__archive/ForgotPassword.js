import React, {Component} from 'react'
import ResetPassword from './ResetPassword'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {StyleSheet, css} from 'aphrodite/no-important'
import * as API from '../../sdk/account'

const {location,localStorage} = window;


class ForgotPassword extends Component {

  render () {
    const {account, actions} = this.props;
    return (
      <div className={css(styles.card)}>
        <div className={css(styles.logo)}>
          Smile
        </div>
        <ResetPassword
          resetPasswordError={account.resetPasswordError}
          handleSendCode={actions.sendVerifyCode}
          registerVerifyCodeCount={account.registerVerifyCodeCount}
          handleSubmit={actions.resetPassword} />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: 480,
    height: 618,
    margin: '60px auto 0px',
    padding: '70px 92px 30px 92px',
    background: '#fff',
    fontSize: 14,
    borderRadius: 2,
    boxShadow: '0 2px 3px rgba(213,213,213,0.7)'
  },
  logo: {
    width: 50,
    height: 200,
    margin: '0 auto',
    fontSize: 43,
    fontFamily: 'Serif',
    color: '#333',
    lineHeight: 55,
    fontWeight: 'bold'
  }
});

export default module.exports = connect((state) => {
  return {
    account: state.account
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({
      /**
       * 发送验证码
       * @param form
       * @returns {function()}
       */
      sendVerifyCode: (form) => async (dispatch, getState) => {
        try {
          const {registerVerifyCodeCount} = getState().account
          if (registerVerifyCodeCount>0) return console.log('count not finish.')
          const result = form.hasOwnProperty('phone')?
            await API.sendVerifyCode(form.phone):
            await API.sendVerifyCodeEmail(form.email)
          if (result.error) throw result.error
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
      },

      // 重置密码
      resetPassword: (form) => async (dispatch,getState) => {
        try {
          const {userName, type, password, code} = form
          const result = await API.resetPassword(userName, type, password, code)
          if (result.error) {
            return dispatch({
              type: "RESET_PASSWORD_ERROR",
              error:result.error
            })
          }
          localStorage.userId = result.user.userId
          localStorage.token = result.userToken.token
          dispatch({
            type: 'RESET_PASSWORD_SUCCESS'
          })
        } catch(e){
          console.log(e)
        }
      },
    }, dispatch)
  }
})(ForgotPassword)