import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {StyleSheet, css} from 'aphrodite/no-important'
import {push} from 'react-router-redux'

class Recent extends Component {
  static defaultProps = {
    style: {}
  };

  componentWillMount = () => {
    // console.log('willmount')
  };

  clickToChat = (item) => {
    console.log(item);
    this.props.push(`/chat?id=${item.id}&name=${item.username}&avatar=${item.avatar}`)
  };


  render () {
    const {style, messagelist} = this.props;
    return (
      <div className={css(styles.container)} style={style}>
        {
          messagelist.list.map(item => (
            <div
              className={css(styles.friendItem)}
              onClick={() => this.clickToChat(item)}
              key={item.key}>
              {/*<div style={{wordBreak: 'break-all'}}>{JSON.stringify(item)}</div>*/}
              <div className={css(styles.friendItem__info)}>
                <img className={css(styles.friendItem__avatar)} src={item.avatar} alt="头像"  />
                <span className={css(styles.friendItem__info__name)}>{item.username}</span>
              </div>
              {
                item.isRead?
                  null:
                  <div className={css(styles.friendItem__readBadge)}>
                    {item.unReadNumber}
                  </div>
              }
            </div>
          ))
        }
      </div>
    )
  }
}


const styles = StyleSheet.create({
  container: {

  },


  friendItem: {
    cursor: 'pointer',
    display: 'flex',
    width: '100%',
    // backgroundColor: '#FFF',
    borderBottom: '1px solid #DDD',
    padding: 10,
    flexDirection: 'row',
    boxSizing: 'border-box',
    justifyContent: 'space-between'
  },

  friendItem__info: {
    display: 'flex',
  },

  friendItem__info__name: {
    alignSelf: 'center',
    fontSize: 14,
    paddingLeft: 20,
    height: 35,
    lineHeight: '35px',
  },

  friendItem__avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },

  friendItem__readBadge: {
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 4,
    minWidth: 13,
    justifyContent: 'center',
    fontSize: 12,
    color: '#FFF',
  }
});


export default module.exports = connect(
  (store) => ({
    messagelist: store.messagelist
  }),
  (dispatch) => bindActionCreators({
    push
  }, dispatch)
)(Recent)