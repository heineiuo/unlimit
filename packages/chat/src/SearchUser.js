import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite/no-important'
import {Link} from 'react-router'
import IconChat from '../componenets/Icons/Chat'
import IconSearch from '../componenets/Icons/IconSearch'
import {connect} from 'react-redux'
import {Motion, spring} from 'react-motion'
import {bindActionCreators} from 'redux'
import {searchUser, clearSearch} from '../store/searchuser'
import {applyFriend, applyFriendClear, getCustomGroup} from '../store/friends'
import Spin from 'react-spin'
import SlideModal from '../componenets/SlideModal'
import * as commonStyles from './common/styles'

class SearchUser extends Component {

  state = {
    keyword: '',
    opened: false,
    isSecondSearch: false,
    cacheKeyword: '',
  };

  toggleOpened = () => {
    this.setState({
      opened: !this.state.opened
    })
  };

  componentWillMount = () => {
    this.props.getCustomGroup();
    this.props.clearSearch()
  };

  componentDidMount = () => {
    this.input.focus()
  };

  handleInputKeyDown = (e) => {
    if (e.key == 'Enter') this.search()
  };

  search = () => {
    if (this.state.keyword.length == 0) return;
    if (!this.state.isSecondSearch) this.setState({isSecondSearch: true});
    this.props.searchUser(this.state.keyword)
  };



  clickApplyFriendBtn = (userinfo) => {
    this.setState({userinfo});
    this.modalApplyFriend.open()
  };


  sendRequest = () => {
    const {applyFriend, groupList} = this.props;
    const {userinfo, remark} = this.state;
    if (groupList.length > 0) {
      const gid = groupList[0].gid;
      applyFriend(userinfo.pals_id, gid, remark);
      this.setState({
        fetching: true
      })
    } else {
      alert('正在获取分组列表')
    }
  };


  clickClose = () => {
    const {applyFriendClear} = this.props;
    const {userinfo} = this.state;
    try {
      applyFriendClear(userinfo.pals_id);
    } catch(e){}

    this.modalApplyFriend.close()
  };


  render () {
    const {children, location, routing, searchuser} = this.props;
    const {query} = location;
    const {opened} = this.state;
    const justifyHeight = window.innerHeight - 120;




    if (this.state.cacheKeyword !== query.name) {
      if (query.auto && query.name !== '') {
        this.setState({keyword: query.name})
      }
      if (query.auto && this.state.keyword !== '' && !this.state.cacheKeyword) {
        this.setState({cacheKeyword: this.state.keyword})
        this.search()
        query.auto = false;
      }
    }

    return (
      <div>
        <div className={css(styles.inputBar)}>
          <input
            ref={(input)=> this.input = input}
            className={css(styles.inputBar__input)}
            type="text"
            onKeyPress={this.handleInputKeyDown}
            value={this.state.keyword}
            onChange={(e) => this.setState({keyword: e.target.value})}
            placeholder="输入"/>
          <div onClick={this.search} className={css(styles.inputBar__search)}>
            <IconSearch width={26} height={26} fill='#666' />
          </div>
        </div>

        <div style={{paddingTop: 20}}>
          {
            searchuser.loading?
              <Spin config={{scale: 0.68, width: 4}} />:
              searchuser.list.length > 0?
                searchuser.list.map(item => (
                  <div key={item.pals_id} className={css(styles.resultItem)}>
                    <img src={item.pals_ico} alt="头像" className={css(styles.resultItem__avatar)} title={item.pals_name} />
                    <div className={css(styles.resultItem__info)}>
                      <span style={{fontSize: 14}}>{item.pals_name}</span>
                    </div>
                    {
                      !item.friends ? <div
                          onClick={() => this.clickApplyFriendBtn(item)}
                          className={css(commonStyles.btn.normal, styles.resultItem__addBtn)}>添加
                        </div>:<div style={{color:'#FF0000',fontWeight: 600}}>已是好友</div>
                    }
                  </div>
                )):
                this.state.isSecondSearch?
                  <div style={{textAlign: 'center'}}>没有结果</div>:
                  null
          }
        </div>


        <SlideModal
          ref={(modal) => this.modalApplyFriend = modal}
          initVisible={false}>

          {
            this.state.userinfo == null?
              null:
              (() => {
                const {friendApplyMap} = this.props;
                const {userinfo} = this.state;
                const isApplying = friendApplyMap.hasOwnProperty(userinfo.pals_id);
                const target = friendApplyMap[userinfo.pals_id];
                const isFetching = isApplying && target && target.status == 'FETCHING_SERVER';

                return (
                  <div>
                    <div style={{padding: 20}} className={css(styles.form)}>
                      <div className={css(styles.form__userinfo)}>
                        <img className={css(styles.avatar)} src={userinfo.pals_ico} alt="头像" style={{
                          width: 60,
                          height: 60
                        }}/>
                        <div style={{alignSelf: 'center'}}>{userinfo.pals_name}</div>
                      </div>
                      <div className={css(styles.form__remark)}>
                          <textarea
                            type="text"
                            className={css(styles.form__remark__input)}
                            placeholder="请输入验证信息"
                            value={this.state.remark}
                            onChange={(e) => this.setState({remark: e.target.value}) } />
                      </div>
                    </div>
                    <div className={css(styles.bottomBar)}>
                      <div
                        className={css(commonStyles.btn.normal, styles.closeBtn)}
                        onClick={this.clickClose}>关闭</div>
                      <div
                        className={css(commonStyles.btn.normal, styles.sendBtn)}
                        onClick={
                          isFetching?
                            () => {}:
                            target && target.status == 'FETCHING_SERVER_SUCCESS'?
                              this.clickClose:
                              target && target.status == 'FETCHING_SERVER_FAIL'?
                                this.sendRequest:
                                this.sendRequest
                        }>
                        <Motion
                          style={{y: spring(isFetching ? 1 : 0, {stiffness: 250, damping: 25})}}>
                          {
                            ({y}) =>
                              <span style={{
                                opacity: y,
                                width: y*18,
                                display: y == 0? 'none':'inline-block'
                              }}>
                                  <Spin config={{scale: 0.4, color: '#fff'}}/>
                                </span>
                          }
                        </Motion>
                        {
                          isFetching?
                            '发送申请':
                            target && target.status == 'FETCHING_SERVER_SUCCESS'?
                              '发送成功':
                              target && target.status == 'FETCHING_SERVER_FAIL'?
                                '发送失败， 点击重试':
                                '发送申请'
                        }
                      </div>
                    </div>
                  </div>
                )

          })()}

        </SlideModal>
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
    backgroundColor: 'transparent!important'
  },

  inputBar__search: {
    cursor: 'pointer',
    width: 30,

  },

  resultItem: {
    position: 'relative',
    margin: '0 20px',
    borderBottom: '1px solid #EEE',
    height: 50,
    boxSizing: 'border-box',
    padding: 5,
    display: 'flex',
  },

  resultItem__avatar: {
    width: 40,
    borderRadius: 20,
  },

  resultItem__info: {
    flex: 1,
    paddingLeft: 5,
    boxSizing: 'border-box'
  },

  resultItem__addBtn: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: 'rgb(87, 157, 180)',
  },


  // 以下是modal里的样式
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },

  form: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  form__userinfo: {
    width: 100,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },

  form__remark: {
    width: 240
  },

  form__remark__input: {
    boxSizing: 'border-box',
    outline: 0,
    border: '1px solid #bfbfbf',
    height: 135,
    padding: 8,
    fontSize: 15,
    borderRadius: 4,
    backgroundColor: '#F8F8F8',
    width: 240,
    resize: 'none',
    lineHeight: '20px'
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row-reverse'
  },

  sendBtn: {
    backgroundColor: '#6799FF',
    marginRight: 10
  },

  closeBtn: {
    backgroundColor: '#F8F8F8',
    color: '#333'
  }
});

export default module.exports = connect(
  (store) => ({
    routing: store.routing,
    searchuser: store.searchuser,
    account: store.account,
    friendApplyMap: store.friends.friendApplyMap,
    groupList: store.friends.groupList,
  }),
  (dispatch) => bindActionCreators({
    getCustomGroup,
    searchUser, clearSearch,
    applyFriend, applyFriendClear
  }, dispatch)
)(SearchUser)
