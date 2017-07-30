import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import DropDown, {DropDownTrigger, DropDownContent} from '@react-web/dropdown'
import DriveSelector from './DriveSelector'
import {StyleSheet, css} from 'aphrodite'
import Paper from '@react-web/paper'
import Modal from 'react-modal'
import Input from '@react-web/input'
import Button from '@react-web/button'
import Title from '../components/Title'
import ProfileDropDown from '../components/ProfileDropDown'
import commonStyles from '../components/commonStyles'

class Header extends Component {

  state = {
    name: '',
    driveId: '',
    modalOpen: false,
  };

  closeDropdown = () => {
    this.dropdown.hide()
  };

  _createHost = () => {
    this.props.createHost({name: this.state.name});
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
    const {match} = this.props;
    return (
      <div className={css(styles.globalHeaderBar)}>
        <div style={{display: 'flex', margin: '0 auto', width: '100%', maxWidth: 1000}}>
          <Title color='#EEE' title="账号" style={{textDecoration: 'none', marginRight: 10}}/>
        </div>
        <div>
        </div>
        <ProfileDropDown />
      </div>
    )
  }
}


const styles = StyleSheet.create({
  ...commonStyles
});

export default module.exports = Header
