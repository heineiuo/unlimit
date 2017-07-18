import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite/no-important'
import {Link} from 'react-router'
import IconChat from '../componenets/Icons/Chat'
import IconSearch from '../componenets/Icons/IconSearch'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {searchUser, clearSearch} from '../store/searchuser'
import {getUserInfo} from '../store/account'
import Spin from 'react-spin'

class Info extends Component {

  state = {
    keyword: '',
    opened: false,
    isSecondSearch: false,
  };

  toggleOpened = () => {
    this.setState({
      opened: !this.state.opened
    })
  };

  componentWillMount = () => {
    // this.props.getUserInfo()
  };

  handleInputKeyDown = (e) => {
    if (e.key == 'Enter') this.search()
  };

  search = () => {
    if (this.state.keyword.length == 0) return;
    if (!this.state.isSecondSearch) this.setState({isSecondSearch: true});
    this.props.searchUser(this.state.keyword)
  };

  render () {
    const {children, location, routing, account} = this.props;
    const {opened} = this.state;
    const {userinfo} = account;
    const justifyHeight = window.innerHeight - 120;

    return (
      <div style={{wordBreak: 'break-all'}}>
        <div>
          token: {account.token}
        </div>
        <div>
          {
            !account.isUserinfoGotAtLeastOnce?
              <Spin />:
              <div>
                <div>
                  code: {userinfo.member_code}
                </div>
                <div>
                  用户名: {userinfo.member_name}
                </div>
                <div>
                  手机: {userinfo.member_mobile}
                </div>
                <div>
                  <img src={userinfo.member_avatar} alt="" style={{width: 60}}/>
                </div>
              </div>
          }
        </div>
      </div>

    )
  }
}

const styles = StyleSheet.create({

  inputBar: {
    display: 'flex',
    borderBottom: '1px solid #BBB',
    margin: '4px 20px',
    boxSizing: 'border-box',
    padding: '15px 5px 5px',
    alignItems: 'flex-end'
  },

  inputBar__input: {
    height: 24,
    flex: 1,
    fontSize: 15,
    lineHeight: '34px',
    display: 'flex',
    padding: 0,
    border: 0,
    outline: 0,
  },

  inputBar__search: {
    cursor: 'pointer',
    width: 30,

  }
});

export default module.exports = connect(
  (state) => ({
    routing: state.routing,
    searchuser: state.searchuser,
    account: state.account
  }),
  (dispatch) => bindActionCreators({
    searchUser, clearSearch, getUserInfo
  }, dispatch)
)(Info)