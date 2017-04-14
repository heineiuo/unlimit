
import React, {Component} from 'react'
import Button from 'react-sea/lib/Button'
import Input from 'react-sea/lib/Input'
import MdClose from 'react-sea/lib/Icons/close'
import {StyleSheet, css} from 'aphrodite'

class PopModal extends Component {

  render () {
    const {tabItem} =this.props;

    return (
      <div className={css(styles.profileEdit)}>
        <div className={css(styles.editHeader)}>
        <span className={css(styles.title)}>
          {
            {
              UserName:<span>修改昵称</span>,
              Email:<span>修改邮箱</span>,
              Phone:<span>修改号码</span>,
              Password:<span>修改密码</span>
            }[tabItem]
          }
        </span>
        <span className={css(styles.closeIcon)} onClick={this.props.closeModal} >
          <MdClose size={24} fill="#999" />
        </span>
      </div>
        <div className={css(styles.editContent)}>
          {
            {
              UserName:(
                <div >
                  <Input type="text" placeholder="昵称" />
                </div>
              ),

              Email: (
                <div >
                  <Input type="password" placeholder="当前密码" />
                  <Input type="text" placeholder="新的邮箱" />
                </div>
              ),

              Phone: (
                <div >
                  <Input type="text" placeholder="新的手机号" />
                </div>
              ),

              Password: (
                <div className={css(styles.editItem)}>
                  <Input type="password" placeholder="当前密码" />
                  <Input type="password" placeholder="新的密码" />
                  <Input type="password" placeholder="确认密码" />
                </div>
              )
            }[tabItem]
          }
        </div>
        <div className={css(styles.editOperation)}>
          <Button style={cancelStyle} onClick={this.props.closeModal}>取消</Button>
          <Button style={submitStyle} onClick={this.handleSubmit}>提交</Button>
        </div>
      </div>
    )
  }
}


const styles = StyleSheet.create({
  editItem: {
    display: 'block'
  },

  editHeader: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    textAlign: 'left',
    textIndent: 20,
    height: 40,
    lineHeight: '40px',
    color: '#666',
    fontSize: 14,
    background: '#f7f9fb',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottom: '1px solid #dadada',
    boxShadow: '0 1px 4px #ddd'
  },

  editContent: {
      paddingTop: 26,
      paddingBottom: 14
  },

  btn: {
    height: 28,
    lineHeight: '28px',
    textAlign: 'center',
    border: '1px solid #c3c4c6',
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    color: '#53585c',
    fontSize: 12,
    padding: '0 30p',
    borderRadius: 2
  },

  editOperation: {
    float: 'right',
    paddingRight: 70,
    marginBottom: 20,
  },

  editItem__input: {
    width: 340,
    padding: 7,
    height: 33,
    lineHeight: '20px',
    background: '#f5f5f5',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
    margin: '4px 20px',
    fontSize: 12,
    border: 'none'
  },

  closeIcon: {
    float: 'right',
    paddingRight: 10
  }

});

const submitStyle = {
  backgroundColor: '#41464b',
  color: '#fff',
  float: 'right',
  cursor: 'pointer',
  width:'120px',
  marginRight: '10px',
  marginTop: '10px',
  lineHeight: '30px',
  borderRadius: 4,
  padding: '0px 40px'
};

const cancelStyle = {
  backgroundColor: '#41464b',
  color: '#fff',
  float: 'right',
  cursor: 'pointer',
  width:'120px',
  marginTop: '10px',
  lineHeight: '30px',
  borderRadius: 4,
  padding: '0px 40px'
};


export default PopModal