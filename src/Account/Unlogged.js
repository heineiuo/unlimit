import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import commonStyles from '../styles'

const codeInputStyle = Object.assign({}, commonStyles.input, {
  width: '164px',
  overflow: 'hidden',
  marginRight: '2px',
  float: 'left'
});

const sendCodeStyle = Object.assign({}, commonStyles.button, {
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

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillUpdate = () => {
    const {account, getAuthCodeAndRedirect} = this.props;
    if (account.logged && this.props.location.query.redirectTo > 0) {
      // getAuthCodeAndRedirect();
      this.props.push(this.props.location.query.redirectTo)
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const {account, location} = this.props;
    if (nextProps.account.logged && location.query.redirectTo) {
      if (
        (!account.loginChecked && nextProps.account.loginChecked) ||
        !account.logged
      ) {
        window.location.href = location.query.redirectTo;
      }
    }
  };

  state = {
    email: '',
    code: '',
    registerError: ''
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') this.submit()
  };

  submit = () => {
    const {email,  code} = this.state;
    this.props.login({email, code})
  };

  sendVerifyCode = () => {
    const {email} = this.state;
    this.props.sendVerifyCode({email});
  };


  componentWillUnmount = () => {
    console.log('wtf, ')
  }


  render (){
    const {account} = this.props;

    return (
      <div className={css(styles.card)}>
        <div className={css(styles.logo)}>
          右括号
        </div>
        <div>
          <div>
            <Input
              style={commonStyles.input}
              type="text"
              value={this.state.email}
              onChange={(e)=>this.setState({email: e.target.value})}
              placeholder="邮箱" />
            <div style={{height: '44px', marginBottom: '2px'}}>
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
            <div className={css(styles.errorMsg, account.registerError !== '' && styles['errorMsg--show'])}>
              {account.registerError}
            </div>
            <Button style={commonStyles.button} onClick={this.submit}>提交</Button>
          </div>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  ...commonStyles
});


export default module.exports = connect(
  (store) => ({
    account: store.account,
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
    login: require('../actions/account/login'),
    sendVerifyCode: require('../actions/account/sendVerifyCode')
  }, dispatch)
)(UnLogged)
