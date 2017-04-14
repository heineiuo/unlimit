import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import hoverHoc from '../common/hoverHoc'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import {css, StyleSheet} from 'aphrodite'

const MemberItem = hoverHoc(props => (
  <div className={css(styles.memberItem)}>
    <div>{props.item.email}</div>
    <div onClick={() => props.removeDriveUser(props.item)}>移出</div>
  </div>
))

class Members extends Component {

  state = {
    addEmail: ""
  }

  componentWillMount = () => {
    const {match: {params: {driveId}}, getDriveUserList} = this.props;
    getDriveUserList({driveId})
  }

  addDriveUser = () => {
    const {match: {params: {driveId}}, addDriveUserByEmail} = this.props;
    addDriveUserByEmail({
      email: this.state.addEmail,
      driveId
    })
  }

  removeDriveUser = (item) => {
    const {match: {params: {driveId}}, editDriveUser} = this.props;
    editDriveUser({driveId, remove: [item]})
  }

  render (){
    const {driveUserList, driveUserAdmin} = this.props;
    const {addEmail} = this.state;

    return (
      <div>
        <div>{driveUserAdmin.email}(管理员)</div>
        <div className={css(styles.searchBar)}>
          <Input type="text" value={addEmail} onChange={e => this.setState({addEmail: e.target.value})} />
          <Button onClick={this.addDriveUser} style={{width: 130}}>添加协作者</Button>
        </div>
        {
          driveUserList.filter(item => item.id !== driveUserAdmin.id).map(item => (
            <MemberItem key={item.id} item={item} removeDriveUser={this.removeDriveUser}/>
          ))
        }
      </div>
    )
  }
}

const styles = StyleSheet.create({
  searchBar: {
    display: 'flex'
  },
  memberItem: {
    display: 'flex'
  }
})



export default module.exports = connect(
  (state) => ({
    host: state.host,
    driveUserAdmin: state.host.driveUserAdmin,
    driveUserList: state.host.driveUserList
  }),
  (dispatch) => bindActionCreators({
    getDriveUserList: require('../../actions/host/getDriveUserList').default,
    addDriveUserByEmail: require('../../actions/host/addDriveUserByEmail').default,
    editDriveUser: require('../../actions/host/editDriveUser').default
  }, dispatch)
)(Members)