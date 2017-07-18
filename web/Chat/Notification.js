import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getSystemMessage, handleFriendRequest} from '../store/messagelist'
import * as commonStyles from './common/styles'
import moment from 'moment'
import Spin from 'react-spin'

class Notification extends Component {

  componentWillMount = () => {
    this.props.getSystemMessage()
  };

  handleFriendRequest = (isAgree, rid) => {
    this.props.handleFriendRequest(isAgree, rid, '10')
  };

  render () {
    const {list, systemMessageUpdating} = this.props;
    console.log(list);

    return (
      <div className={css(styles.container)}>
        {
          systemMessageUpdating?
            <Spin />:
            list.map(item => (
              <div key={item.rid} className={css(styles.noticeItem)}>
                <div className={css(styles.noticeItem__info)}>
                  <div style={{fontSize: 14}}>
                    {
                      item.NType == 'FRIEND_REQUEST'?
                        item.from_id:
                        null
                    }
                    {item.content}
                  </div>
                </div>
                <div className={css(styles.bottomBar)}>
                  <div className={css(styles.bottomBar_time)}>
                    {moment(new Date(item.time * 1000)).from()}
                  </div>
                  {
                    item.NType == 'FRIEND_REQUEST'?
                      <div className={css(styles.handles)}>
                        <div
                          onClick={() => this.handleFriendRequest(true, item.rid)}
                          className={css(
                            commonStyles.btn.normal,
                            styles.handles__btn,
                            styles.handles__btn_agree
                            )}>同意</div>
                        <div
                          onClick={() => this.handleFriendRequest(false, item.rid)}
                          className={css(
                            commonStyles.btn.normal,
                            styles.handles__btn,
                            styles.handles__btn_refuse
                            )}>拒绝</div>
                      </div>:
                      item.NType == 'FRIEND_DELETE'?
                        null:
                        item.NType == 'FRIEND_REQUEST_AGREE'?
                          <div className={css(styles.handles)}>
                            <div>已同意</div>
                          </div>:
                          item.NType == 'FRIEND_REQUEST_REFUSE'?
                            <div className={css(styles.handles)}>
                              <div>已拒绝</div>
                            </div>:
                            null

                  }
                </div>

              </div>
            ))
        }
      </div>

    )
  }
}

const styles = StyleSheet.create({

  container: {
    // position: 'absolute',
    // top: 50,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // overflowY: 'auto'
  },

  noticeItem: {
    position: 'relative',
    borderBottom: '1px solid #EEE',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding: '5px 10px',

    // 卡片
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    margin: 10,
    boxShadow: '0 0 10px #dedede'
  },

  noticeItem__info: {
    flex: 1,
    color: '#333'
  },

  bottomBar: {
    display: 'flex',
    flexDirection: 'row'
  },

  bottomBar_time: {
    display: 'flex',
    width: 200,
    lineHeight: '25px',
    color: '#666',
    fontSize: 14,
    alignSelf: 'flex-start'
  },

  handles: {
    // position: 'absolute',
    right: 20,
    top: 10,
    width: 130,
    height: 25,
    display: 'flex',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  handles__btn: {
    flex: 1,
    fontSize: 13,
    height: 25,
    lineHeight: '25px',
    margin: '0 3px'
  },

  handles__btn_agree: {
    backgroundColor: 'rgba(87, 157, 180, 1)'
  },

  handles__btn_refuse: {
    backgroundColor: 'rgba(228, 112, 0, 1)'
  }
});

export default module.exports = connect(
  (store) => ({
    routing: store.routing,
    searchuser: store.searchuser,
    account: store.account,
    list: store.messagelist.systemmessage.list,
    systemMessageUpdating: store.messagelist.systemMessageUpdating
  }),
  (dispatch) => bindActionCreators({
    getSystemMessage, handleFriendRequest
  }, dispatch)
)(Notification)