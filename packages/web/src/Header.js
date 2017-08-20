import React, {Component} from 'react'
import { withRouter, Route, Link } from 'react-router-dom'
import DropDown, {DropDownTrigger, DropDownContent} from '@react-web/dropdown'
import {StyleSheet, css} from 'aphrodite'
import Paper from '@react-web/paper'
import Modal from 'react-modal'
import Input from '@react-web/input'
import Button from '@react-web/button'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ProfileDropDown from './account/ProfileDropDown'
import commonStyles from './common/styles'
import { mutateInsertOne } from './db'
import Logo from './common/smile'

class Header extends Component {

  state = {
    name: '',
    driveId: '',
    modalOpen: false,
  }

  closeDropdown = () => {
    this.dropdown.hide()
  }

  _createHost = () => {
    this.props.createHost({name: this.state.name})
    this.setState({modalOpen: false})
  }

  handleClickOpenModal = () => {
    this.setState({
      modalOpen: true
    })
  }

  cancel = () => {
    this.setState({
      modalOpen: false
    })
  }

  render(){
    const {match, title, color, style, account} = this.props
    if (!account.logged) return null
    
    return (
      <div className={css(styles.globalHeaderBar)}>
        <div style={{display: 'flex', margin: '0 auto', width: '100%', maxWidth: 1000}}>
        <DropDown ref={ref => this.dropDown = ref} className={css(styles.title)} style={style}>
          <DropDownTrigger>
            <div style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
              <Logo color={color} />
              <div style={{color, userSelect: 'none'}}>{title}</div>
            </div>
          </DropDownTrigger>
          <DropDownContent>
            <div className={css(styles.title__content)}>
              <div className={css(styles.triangle)} />
              <Link onClick={this.closeContent} className={css(styles.link)} to="/">消息</Link>
              <Link onClick={this.closeContent} className={css(styles.link)} to="/drive">空间</Link>
              <Link onClick={this.closeContent} className={css(styles.link)} to="/account">账号</Link>
            </div>
          </DropDownContent>
        </DropDown>

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
  ...commonStyles,

  title: {
    display: 'flex',
    cursor: 'pointer'
  },

  title__content: {
    display: 'flex',
    position: 'relative',
    alignSelf: 'center',
    flexDirection: 'column',
  },

  triangle: {
    position: 'absolute',
    left: '50%',
    width: 0,
    height: 0,
    marginLeft: '-10px',
    marginTop: '-20px',
    border: '10px solid transparent',
    borderBottomColor: '#FFF'
  },

  link: {
    padding: '0 20px',
    height: '30px',
    color: '#555',
    lineHeight: '30px',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: '#1077ff',
      color: '#222'
    }
  }
})

export default withRouter(connect(
  store => ({
    account: store.account
  }),
  dispatch => bindActionCreators({
    createHost: mutateInsertOne
  }, dispatch)
)(Header))
