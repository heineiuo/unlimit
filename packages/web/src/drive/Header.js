import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import DropDown, {DropDownTrigger, DropDownContent} from '@react-web/dropdown'
import DriveSelector from './DriveSelector'
import {StyleSheet, css} from 'aphrodite'
import Paper from '@react-web/paper'
import Modal from 'react-modal'
import Input from '@react-web/input'
import Button from '@react-web/button'
import Title from '../Title'
import ProfileDropDown from '../ProfileDropDown'
import commonStyles from '../styles'

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
        <div style={{display: 'flex'}}>
          <Title color='#EEE' title="协作空间" style={{textDecoration: 'none', marginRight: 10}}/>
          <span>
            <Link to='/drive' style={{color: '#666', fontSize: 13}}>全部空间</Link>
            <Route path={`${match.path}/`} exact render={() => (
              <span style={{color: '#FFF'}} onClick={() => this.setState({modalOpen: true})}>创建空间</span>
            )}/>
            <Modal
              style={{overlay: commonStyles.modal__overlay, content: commonStyles.modal__content}}
              ref={(modal) => this.modal = modal}
              contentLabel="ADD_HOST"
              isOpen={this.state.modalOpen}>
                <Paper>
                  {/*<div>添加一个域名</div>*/}
                  <div>
                    <Input
                      label="添加域名"
                      name="name"
                      id="input-hostname"
                      type="text"
                      style={{marginBottom: 20}}
                      onChange={(e)=>{this.setState({name: e.target.value})}}
                      value={this.state.name}
                      placeholder="请输入域名"  />
                    <div style={{textAlign: 'right'}}>
                      <Button style={{width: 100, marginRight: 10}} type="secondary" onClick={this.cancel}>取消</Button>
                      <Button style={{width: 100}} onClick={this._createHost}>提交</Button>
                    </div>
                  </div>
                </Paper>
              </Modal>
          </span>
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
