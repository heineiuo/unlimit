import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getFriendList, deleteFriend, resetDeleteFriendState} from '../store/friends'
import {StyleSheet, css} from 'aphrodite/no-important'
import {push} from 'react-router-redux'
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import IconDropMenu from '../componenets/Icons/IconDropMenu'

import SlideModal from '../componenets/SlideModal'
import * as commonStyles from './common/styles'

class Friends extends Component {

  static defaultProps = {
    style: {}
  };

  state = {

  };

  dropdowns = {};

  componentWillMount = () => {
    this.props.getFriendList()
  };

  clickToChat = (item) => {
    console.log(item);
    this.props.push(`/chat?id=${item.pals_id}&name=${item.u_name}&avatar=${item.u_ico}`)
  };

  clickToDeleteFriend = (userinfo) => {

    this.setState({userinfo});
    // this.modal.getWrappedInstance().open()
    try { this.dropdowns[userinfo.pals_id].hide() } catch(e){}
    this.modal.open()
  };

  clickClose = () => {
    this.modal.close()
    this.props.resetDeleteFriendState();
  };

  clickConfirmBtn = () => {
    const {deleteFriend,account} = this.props;
    const {userinfo} = this.state;

    deleteFriend(userinfo.pals_id);

  };

  render () {
    const {friends, style, account} = this.props;
    const friendlist = friends.list;
    const {userinfo} = this.state;

    return (
      <div style={style} className={css(styles.container)}>
        {
          friendlist.filter(item => item.pals_id != account.userinfo.uid).map(item => (
            <div
              className={css(styles.friendItem)}
              key={item.pals_id}>
              <div
                className={css(styles.friendItem__info)}
                onClick={() => this.clickToChat(item)}>
                <img src={item.u_ico} alt="头像" className={css(styles.friendItem__avatar)} />
                <span className={css(styles.friendItem__username)}>{item.u_name}</span>
              </div>
              <div className={css(styles.friendItem__setting)}>
                <DropDown ref={dropdown => this.dropdowns[item.pals_id] = dropdown}>
                  <DropDownTrigger>
                    <IconDropMenu fill="#888"/>
                  </DropDownTrigger>
                  <DropDownContent>
                    <div className={css(styles.friendItem__dropMenu)}>
                      <div className={css(styles.friendItem__settingItem)} onClick={() => this.clickToDeleteFriend(item)}>删除好友</div>
                      <div className={css(styles.friendItem__settingItem)} >修改备注</div>
                    </div>
                  </DropDownContent>
                </DropDown>
              </div>
            </div>
          ))
        }
        <SlideModal
          ref={modal => this.modal = modal}
          initVisible={false}
        >
          {

            typeof userinfo == "object" ?
              <div style={{padding: '60px 10px'}}>
                <div style={{textAlign: 'center'}}>
                  删除后你将从对方列表中消失
                </div>
                <div style={{display: 'flex',padding: '30px'}}>
                  <img title="头像" src={userinfo.u_ico} alt="头像" className={css(styles.avatar)}/>
                  <span title="昵称" className={css(styles.name)}>{userinfo.u_name}</span>
                </div>

                <div style={{display: '-webkit-inline-box',float: 'right'}}>
                  {
                    (() => {
                      switch (friends.deleteFriendState){
                        case 0:
                          return (
                            <div
                              className={css(commonStyles.btn.normal, styles.commitBtn)}
                              onClick={this.clickConfirmBtn}>确认</div>
                          );
                        case 1:
                          return (
                            <div
                              className={css(commonStyles.btn.normal, styles.commitBtn)}
                              >正在删除</div>
                          );
                        case 2:
                          return (
                            <div
                              className={css(commonStyles.btn.normal, styles.commitBtn)}
                              onClick={this.clickClose}
                            >删除成功,关闭</div>
                          );
                        case 3:
                          return (
                            <div
                              className={css(commonStyles.btn.normal, styles.commitBtn)}
                              onClick={this.clickConfirmBtn}
                            >X 重试</div>
                          );
                      }
                    })()
                  }

                  <div
                    className={css(commonStyles.btn.normal, styles.closeBtn)}
                    onClick={this.clickClose}
                  >
                    取消
                  </div>
                </div>
              </div>
              :null

          }

        </SlideModal>

      </div>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },

  friendItem: {
    cursor: 'pointer',
    display: 'flex',
    width: '100%',
    // backgroundColor: '#FFF',
    borderBottom: '1px solid #DDD',
    padding: 10,
    justifyContent: "space-between",
    boxSizing: 'border-box',

  },
  friendItem__settingItem:{
    padding: '0px 20px',
    ':hover':{
      backgroundColor: '#289ef0',
      color: '#fff'
    }
  },
  friendItem__avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },

  friendItem__setting: {
    lineHeight: '30px'
  },

  friendItem__username: {
    fontSize: 14,
    lineHeight: '35px',
    marginLeft: 20,
    height: 35
  },

  friendItem__info: {
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none'
  },

  friendItem__dropMenu: {
    backgroundColor: '#FFF',
    padding: '10px 0',
    position: 'absolute',
    right: 10,
    boxShadow: '0 2px 5px #b7b7b7',
    fontSize: 14,
    lineHeight: '22px',
  },

  avatar:{
    width: '40px',
    height: '40px;',
    borderRadius: '20px'
  },

  name:{
    fontSize: '14px',
    lineHeight: '40px',
    marginLeft: '20px',
    textAlign: 'center',
    height: '40px',
  },

  commitBtn:{
    backgroundColor: '#2e8ded',
    marginRight: '10px'
  },

  closeBtn: {
    backgroundColor: '#F8F8F8',
    color: '#333'
  }

});

export default module.exports = connect(
  (store) => ({
    account: store.account,
    friends: store.friends
  }),
  (dispatch) => bindActionCreators({
    getFriendList, push, deleteFriend,resetDeleteFriendState
  }, dispatch)
)(Friends)