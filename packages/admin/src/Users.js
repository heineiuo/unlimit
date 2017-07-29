import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Spin from 'react-spin'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {fetchUserList} from '../actions/admin'
import UserItem from './UserItem'

class Users extends Component {

  componentDidMount = () => {
    this.props.fetchUserList()
  };

  render () {
    const {admin: {userListState, userList}} = this.props;

    return (
      <div>
        {
          userListState < 2 ? <Spin /> :
          userListState == 3? <div>遇到错误</div> :
            <div>
              {
                userList.map((item, index) => (
                  <UserItem key={item._id} user={item} index={index} />
                ))
              }
            </div>
        }
      </div>
    )
  }
}



export default module.exports = connect(
  (store) => ({
    admin: store.admin,
    account: store.account
  }),
  (dispatch) => bindActionCreators({
    fetchUserList
  }, dispatch)
)(Users);
