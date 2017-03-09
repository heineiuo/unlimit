import React, {Component} from 'react'
import {Link} from 'react-router'
import Modal from 'react-modal'
import Button from 'react-sea/lib/Button'
import PopModal from '../PopModal'
import commonStyles from '../common/styles'
import ImageUpload from 'react-sea/lib/ImageUpload'
import DropDown,{DropDownTrigger,DropDownContent}from 'react-sea/lib/DropDown'
import {StyleSheet, css} from 'aphrodite/no-important'

class Profile extends Component {

  state = {
    modalIsOpen: false,
    tabItem: ''
  };

  openModal = (e,clicktab) => {
    this.setState({
      modalIsOpen: true,
      tabItem: clicktab
    })
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    })
  };


  handleLogout = () => {
    this.props.logout()
  };

  render () {
    return (
      <div className={css(styles.card)}>
        <div className={css(styles.profileLeft)}>
          <ImageUpload />
        </div>
        <div className={css(styles.profileRight)}>
          <div className={css(styles.itemInfo)}>
            <span className={css(styles.itemName)} >昵称</span>
            <span className={css(styles.itemContent)}>
            <span className={css(styles.itemSpan)}></span>
             <a className={css(styles.itemEdit)}  onClick={(e) => this.openModal(e,'UserName')}>修改昵称</a>
          </span>
          </div>
          <div className={css(styles.itemInfo)}>
          <span className={css(styles.itemName)}>
            <span>邮箱</span>
          </span>
          <span className={css(styles.itemContent)}>
            <span className={css(styles.itemSpan)}>{this.props.account.email}</span>
             <a className={css(styles.itemEdit)}  onClick={(e) => this.openModal(e,'Email')}>修改邮箱</a>
          </span>
          </div>

          <div className={css(styles.itemInfo)}>
          <span className={css(styles.itemName)}>
            <span>电话</span>
          </span>
            <span className={css(styles.itemContent)}>
            <span className={css(styles.itemSpan)}>...</span>
            <a className={css(styles.itemEdit)}  onClick={(e) => this.openModal(e,'Phone')}>修改号码</a>
          </span>
          </div>

          <div className={css(styles.itemInfo)}>
          <span className={css(styles.itemName)}>
            <span>密码</span>
          </span>
            <span className={css(styles.itemContent)}>
            <span className={css(styles.itemSpan)}>******</span>
            <a className={css(styles.itemEdit)}  onClick={(e) => this.openModal(e,'Password')}>修改密码</a>
          </span>
          </div>
          <Button style={buttonStyle} onClick={this.handleLogout}>退出</Button>
          <Modal
            contentLabel="Modal"
            isOpen={this.state.modalIsOpen}
            style={customStyles}>
            <PopModal closeModal={this.closeModal} tabItem={this.state.tabItem} />
          </Modal>
        </div>

      </div>
    )
  }
}

const styles = StyleSheet.create({

  ...commonStyles,

  userNameInput: {
    boxSizing: 'border-box',
    height: 26,
    lineHeight: '20px',
    padding: 2,
    borderRadius: 1,
    width: '100%',
    maxWidth: 160,
    outline: 'none',
    fontSize: 14,
    border: '1px solid #333',
    boxShadow: 'none'
  },

  itemInfo: {
    marginTop: 10
  },

  itemSpan: {
    width: '100%',
    maxWidth: 140,
    display: 'inline-block'
  },

  inputWrapper: {
    display: 'inline-block',
    backgroundColor: '#00A000',
  },

  itemName: {
    width: 45,
    display: 'inline-block',
    margin: '0 10px 0 0px',
    textAlign: 'left',
    verticalAlign: 'top',
    lineHeight: '30px'
  },

  itemContent: {
    maxWidth: 450,
    lineHeight: '30px'
  },

  itemEdit: {
    color: '#6093bb',
    marginLeft: 15,
    fontSize: 14,
  },

  profileLeft: {
    float: 'left',
    display: 'inline',
    width: 58,
    marginRight: 30,
    marginTop: 10
  },

  profileRight: {
    float: 'left',
    width: 310
  },

  /*账户中心*/
  configAvatar: {
    position: 'absolute',
    right: 0,
    top: 11,
    height: 24,
    width: 24,
    lineHeight: '24px',
    borderRadius: 24,
    display: 'inline-block',
    overflow: 'hidden',
    padding: 0,
  },

  configAvatar__img: {
    width: '100%',
    height: '100%',
  },

  accountSetting: {
    boxShadow: '0px 2px 8px #ccc',
    borderRadius: 2,
    zIndex: 1000,
    left: 0,
    width: 240,
    top: 48,
    position: 'absolute',
    fontSize: 14,
    backgroundColor: '#fff'
  },

  configContent: {
    margin: '0 20px 10px 20px',
    paddingBottom: 16,
    lineHeight: '0px',
    textAlign: 'center',
    borderBottom: '1px solid #e5e5e5'
  },

  personalImg: {
    height: 40,
    width: 40,
    margin: '20px 0 10px 0',
    borderRadius: '50%',
  },

  configUserName: {
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    lineHeight: '12px',
    color: '#41464b',
  },

  configUserEmail: {
    margin: '8px 0 10px 0',
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 12,
    lineHeight: '12px',
    color: '#41464b',
  },

  configBoxItem: {
    display: 'block',
    cursor: 'pointer',
    color: '#666',
    height: '30px',
    lineHeight: '30px',
    fontSize: '12px',
    paddingLeft: '20px',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  }

});


const customStyles = {
  overlay : {
    position : 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '380px',
    padding: '0px',
    borderRadius: 0,
    border:0,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const buttonStyle = {
  backgroundColor: '#41464b',
  color: '#fff',
  cursor: 'pointer',
  width:'120px',
  marginTop: '25px',
  lineHeight: '35px',
  borderRadius: 2
};


export default Profile