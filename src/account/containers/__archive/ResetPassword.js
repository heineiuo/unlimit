import React, {Component} from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'

class ResetPassword extends Component {

  state = {
    resetPasswordError: ''
  }

  static defaultProps = {
    handleSendCode: () => {},
    handleClickSubmit: () => {}
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(Object.assign({}, this.state, nextProps))
  }

  handleKeyPress = (e) => {
    if (e.key == 'Enter') {
      console.log('Enter')
      this.handleSendCode()
    }
  }

  handleSubmit = () => {
    console.log('handle submit')
    const {handleSubmit} = this.props
    const {userName, password, code} = this.state
    const regPhone = /^1[0-9]{10}/
    const regEmail= /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/
    if (regPhone.test(userName)){
      const type = 'phone'
      handleSubmit({userName, type, password, code})
    }else if(regEmail.test(userName)){
      const type = 'email'
      handleSubmit({userName, type, password, code})
    }else(
      this.setState({resetPasswordError: '格式不正确'})
    )
  }

  handleSendCode = () => {
    const {handleSendCode} = this.props
    const {userName} = this.state
    console.log('handle Send code', userName)
    if (phone && phone.length==11) {
      handleSendCode(userName)
    }
  }

  render (){


    const codeInputStyle = Object.assign({}, inputStyle, {
      width: '174px',
      overflow: 'hidden',
      marginRight: '2px',
      float: 'left'
    })

    const inputCodeBarStyle = {
      height: '44px',
      marginBottom: '2px'
    }

    const {registerVerifyCodeCount} = this.props
    console.log(registerVerifyCodeCount)
    const {resetPasswordError} = this.state

    const sendCodeText = registerVerifyCodeCount>0?
      `${registerVerifyCodeCount}s后可重发`: '发送验证码'

    const sendCodeStyle = Object.assign({}, buttonStyle, {
      width: '120px',
      float: 'left',
      marginTop: 0
    }, {backgroundColor: registerVerifyCodeCount>0?'#CCC':'#41464b'})

    return (
      <div className={style.form}>
        <Input style={inputStyle}
               type="text"
               value={this.state.userName}
               onChange={(e)=>this.setState({userName: e.target.value})}
               placeholder="手机号" />
        <div style={inputCodeBarStyle}>
          <Input type="text"
                 value={this.state.code}
                 style={codeInputStyle}
                 onChange={(e)=>this.setState({code: e.target.value})}
                 placeholder="手机验证码" />
          <Button style={sendCodeStyle}
                  onClick={this.handleSendCode}>{sendCodeText}</Button>
        </div>
        <Input style={inputStyle}
               type="password"
               value={this.state.password}
               onChange={(e)=>this.setState({password: e.target.value})}
               onKeyPress={this.handleKeyPress}
               placeholder="密码(6-20位字母或数字)"/>
        <div className={cx('errorMsg', {show: resetPasswordError != ''})}>
          {resetPasswordError}
        </div>
        <Button style={buttonStyle}
                onClick={this.handleSubmit}>确认</Button>
      </div>
    )
  }
}


const inputStyle = {
  backgroundColor: '#f5f5f5',
  height: '44px',
  border: '0px',
  padding: '0 8px',
  color: '#333',
  marginBottom: '2px'
}

const buttonStyle = {
  marginTop: '10px',
  backgroundColor: '#41464b',
  color: '#fff',
  cursor: 'pointer',
  borderRadius: '2px'
}


export default ResetPassword