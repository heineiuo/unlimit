import React, {Component} from 'react'
import {Link} from 'react-router'
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import HostSelector from './HostSelector'
import {StyleSheet, css} from 'aphrodite/no-important'
import Paper from 'react-sea/lib/Paper'
import Modal from 'react-modal'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import Title from '../Title'

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
        <div style={{display: 'flex'}}>
          <Title title="协作空间" style={{textDecoration: 'none', marginRight: 10}}/>
          <span>
            <DropDown ref={dropdown => this.dropdown=dropdown}>
              <DropDownTrigger>
                <span style={{color: '#666', fontSize: 13}}>切换空间</span>
              </DropDownTrigger>
              <DropDownContent>
                <HostSelector
                  host={host}
                  getHostList={getHostList}
                  deleteHost={deleteHost}
                  openHostCreateModal={this.handleClickOpenModal}
                  style={{position: 'absolute', left: 120}}
                  closeDropdown={this.closeDropdown}/>
                <Modal
                  style={customStyles}
                  ref={(modal) => this.modal = modal}
                  contentLabel="ADD_HOST"
                  isOpen={this.state.modalOpen}>
              <Paper>
                {/*<div>添加一个域名</div>*/}
                <div>
                  <Input
                    label="添加域名"
                    name="hostname"
                    id="input-hostname"
                    type="text"
                    style={{marginBottom: 20}}
                    onChange={(e)=>{this.setState({hostName: e.target.value})}}
                    value={this.state.hostName}
                    placeholder="请输入域名"  />
                  <div style={{textAlign: 'right'}}>
                    <Button style={{width: 100, marginRight: 10}} type="secondary" onClick={this.cancel}>取消</Button>
                    <Button style={{width: 100}} onClick={this._createHost}>提交</Button>
                  </div>
                </div>
              </Paper>
            </Modal>
              </DropDownContent>
            </DropDown>
          </span>
        </div>
        {/*<div>{nav.title}</div>*/}
        <div style={{display: 'flex'}}>


          <span>
            <DropDown ref={ref => this.accountMenu=ref}>
              <DropDownTrigger>我</DropDownTrigger>
              <DropDownContent>
                <div style={{position: 'absolute', right: 0}}>
                  <Link to="/account">账号</Link>
                </div>
              </DropDownContent>
            </DropDown>
          </span>
        </div>
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