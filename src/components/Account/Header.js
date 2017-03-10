import React, {Component} from 'react'
import {Link} from 'react-router'
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import {StyleSheet, css} from 'aphrodite/no-important'
import Paper from 'react-sea/lib/Paper'
import Modal from 'react-modal'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import Title from '../common/Title'
import ProfileDropDown from '../common/ProfileDropDown'

class Header extends Component {

  state = {
    hostName: '',
    modalOpen: false,
  };

  closeDropdown = () => {
    this.dropdown.hide()
  };

  _createHost = () => {
    this.props.createHost({hostname: this.state.hostName});
    this.setState({modalOpen: false})
  };

  handleClickOpenModal = () => {
    this.setState({
      modalOpen: true
    })
  };

  cancel = () => {
    this.setState({
      modalOpen: false
    })
  };

  render(){
    const {nav, host, getHostList, deleteHost} = this.props;

    return (
      <div className={css(styles.headerBar)}>
        <Title color="rgb(255, 145, 0)" title="账号" />
        {/*<div>{nav.title}</div>*/}
        <ProfileDropDown />

      </div>
    )
  }
}

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

const styles = StyleSheet.create({
  headerBar: {
    position: 'fixed',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    height: 56,
    // borderBottom: '1px solid #e2e2e2',
    backgroundColor: '#FFF',
    // backgroundColor: '#212a2d',
    lineHeight: `${56}px`,
    marginBottom: 10,
  }
});

export default module.exports = Header