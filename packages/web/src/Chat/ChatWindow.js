import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {css, StyleSheet} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {sendMessage, markRead, pushAutoMarkRead, cancelAutoMarkRead} from '../store/messagelist'
import {goBack} from 'react-router-redux'
import IconArrowBack from '../componenets/Icons/IconArrowBack'
import moment from 'moment'

class ChatWindow extends Component {

  state = {
    input: ''
  };

  componentWillMount = () => {
    const {markRead, pushAutoMarkRead, location} = this.props;
    const {id} = location.query;
    markRead('FRIEND', {id});
    pushAutoMarkRead(id)
  };

  componentWillUnmount = () => {
    const {cancelAutoMarkRead, location} = this.props;
    const {id} = location.query;
    cancelAutoMarkRead(id)
  };

  componentDidMount = () => {
    this.input.focus();
    this.scrollToBottom();
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    this.scrollView.scrollTop = this.scrollView.scrollHeight;
  };

  inputKeyPress = (e) => {
    const {input} = this.state;
    const {sendMessage, location} = this.props;
    // console.log(params, location);
    if (e.key == 'Enter' && input.length > 0) {
      sendMessage('friend', location.query.id, input);
      this.setState({input: ''})
    }
  };

  render () {
    const {children, location, messages, account, goBack, theme} = this.props;
    const {query} = location;
    const {userinfo} = account;
    const isSelf = (id) => id == userinfo.uid;

    return (
      <div className={css(styles.SecondLevel)}>
        <div className={css(styles.header)} style={{backgroundColor: theme.mainColor}}>
          <div onClick={goBack} className={css(styles.header__back)}>
            <IconArrowBack style={{marginTop: -4, marginLeft: -6}} width={28} height={28} fill='#FFFFFF' />
            <span style={{color: '#FFF', fontSize: 18}}>返回</span>
          </div>
          <span className={css(styles.header__title)}>
            {query.name}
          </span>
        </div>

        <div
          ref={(scrollView) => this.scrollView = scrollView}
          className={css(styles.center)}>
          {
            !messages.hasOwnProperty(`friend__${query.id}`)?
              null:
              messages[`friend__${query.id}`].map((item, index) => (
                <div key={index} className={css(styles.chatItem)}>
                  {/*<div style={{wordBreak: 'break-all'}}>{JSON.stringify(item)}</div>*/}
                  {
                    index == 0 || item.timestamp - messages[`friend__${query.id}`][index - 1].timestamp > 1000 * 60 * 10?
                      <div className={css(styles.chatItem__time)}>{moment(new Date(item.timestamp)).from()}</div>:
                      null
                  }
                  <div className={css(styles.chatBox)}>
                    <div className={css(styles.chatBox__inner, isSelf(item.from_id) && styles.chatBox__inner_self)}>
                      <img
                        className={css(styles.chatBox__avatar)}
                        src={isSelf(item.from_id)?userinfo.member_avatar:query.avatar} alt=""/>
                      <div className={css(styles.chatBox__content)}>{item.content}</div>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>

        <div className={css(styles.bottom)}>
          <input
            ref={(input) => this.input = input}
            placeholder="请输入消息"
            value={this.state.input}
            onKeyPress={this.inputKeyPress}
            //className={css(styles.bottom__input)}
            style={styles.bottom__input._definition}
            onChange={(e) => this.setState({input: e.target.value})}
            type="text"/>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  SecondLevel: {
    paddingTop: 50
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
    height: 50,
    borderRadius: '8px 8px 0 0',
    backgroundColor: 'rgb(226, 112, 28)', // theme
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,.16)'
  },

  center: {
    position: 'absolute',
    boxSizing: 'border-box',
    top: 0,
    paddingTop: 50,
    left: 0,
    bottom: 50,
    width: '100%',
    boxShadow: 'inner 0 0 20px #666',
    borderRadius: 8,
    overflowX: 'hidden',
    overflowY: 'auto'
  },

  header__back: {
    cursor: 'pointer',
    borderRadius: 4,
    position: 'absolute',
    left: 4,
    top: 5,
    height: 40,
    width: 90,
    textDecoration: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    lineHeight: '40px',
    transition: 'all 0.15s ease',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
  },

  header__title: {
    lineHeight: '50px',
    fontSize: 20,
    color: '#FFF'
  },

  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    left: 0,
    height: 50,
    borderRadius: '0 0 8px 8px',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    zIndex: 10,
    display: 'flex',
  },

  bottom__input: {
    flex: 1,
    border: 0,
    outline: 0,
    boxShadow: '0 -2px 15px #999',
    borderRadius: '0 0 8px 8px',
    padding: '5px 10px',
    fontSize: 16,
  },

  chatItem: {
    padding: 10,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },

  chatItem__time: {
    textAlign: 'center',
    alignSelf: 'center',
    height: 20,
    lineHeight: '20px',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '0 10px',
    borderRadius: 4,
    color: '#fff',
    marginBottom: 10
  },

  chatBox: {
    display: 'flex',
    flexDirection: 'column'
  },

  chatBox__inner: {
    flex: 1,
    alignSelf: 'flex-start',
    display: 'flex',
  },

  chatBox__avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  chatBox__inner_self: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse'
  },

  chatBox__content: {
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: '6px 10px',
    lineHeight: '28px',
    borderRadius: 4,
    boxShadow: '0 0 5px #d0d0d0',
    maxWidth: 240,
    wordBreak: 'break-word'
  }

});

export default module.exports = connect(
  (store) => ({
    displayOpened: store.display.opened,
    messages: store.messagelist.messages,
    theme: store.theme.current,
    account: store.account,
  }),
  (dispatch) => bindActionCreators({
    sendMessage, goBack, markRead, pushAutoMarkRead, cancelAutoMarkRead
  }, dispatch)
)(ChatWindow)