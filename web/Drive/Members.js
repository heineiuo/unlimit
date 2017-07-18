import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import {css, StyleSheet} from 'aphrodite'
import hoverHoc from '../components/hoverHoc'

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
    const {match: {params: {driveId}}, queryUserList} = this.props;
    queryUserList({driveId})
  }

  addDriveUser = (userId) => {
    const {match: {params: {driveId}}, mutateUsers} = this.props;
    mutateUsers({driveId, add: [userId]})
  }

  removeDriveUser = (item) => {
    const {match: {params: {driveId}}, mutateUsers} = this.props;
    mutateUsers({driveId, remove: [item]})
  }

  onEmailChange = (e) => {
    this.setState({addEmail: e.target.value})
  }

  render (){
    const {driveUserList, driveUserAdmin, adminId} = this.props;
    const {addEmail} = this.state;

    return (
      <div>
        <div>{adminId}(管理员)</div>
        <div className={css(styles.searchBar)}>
          <Input type="text" value={addEmail} onChange={this.onEmailChange} />
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
    host: state.drive,
    driveUserAdmin: state.drive.driveUserAdmin,
    driveUserList: state.drive.driveUserList,
    adminId: state.drive.adminId
  }),
  (dispatch) => bindActionCreators({
    queryUserList: require('../actions/drive/queryUserList').default,
    queryOneByEmail: require('../actions/account/queryOneByEmail').default,
    mutateUsers: require('../actions/drive/mutateUsers').default
  }, dispatch)
)(Members)
