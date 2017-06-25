import React, {Component} from 'react'
import {Link} from 'react-router'
import {css, StyleSheet} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import IconAdd from '../componenets/Icons/IconAdd'
import IconCloth from '../componenets/Icons/IconCloth'
import IconInfo from '../componenets/Icons/IconInfo'
import IconSearch from '../componenets/Icons/IconSearch'
import IconNotification from '../componenets/Icons/IconNotification'
import {bindActionCreators} from 'redux'
import {TabBar, TabPane} from '../componenets/Tabbar'
import {push} from 'react-router-redux'
import {getFriendList} from '../store/friends'
import {Motion, TransitionMotion, spring} from 'react-motion'
import Friends from './Friends'
import Recent from './Recent'
import Groups from './Groups'
import IconChat from '../componenets/Icons/Chat2'
import IconFriends from '../componenets/Icons/IconFriends'
import IconGroups from '../componenets/Icons/IconGroups'

class NavWrap extends Component {

  state = {
    type: 'RECENT',
  };

  componentWillMount = () => {
    this.setState({
      type: this.props.location.query.type || 'RECENT'
    })
  };


  onSwitchTabHandle = (key) => {
    this.props.push(`/?type=${key}`);
    this.setState({
      type: key
    })
  };

  render () {
    const {children, theme, messagelist: {systemmessage: {untreated}}} = this.props;
    const {type} = this.state;
    const bottom_btn_icon_size = 28;
    const commonTabPaneProps = {fill: '#FFF', width: 35, height: 35};
    const tabs = [
      ['RECENT', '聊天', <IconChat {...commonTabPaneProps} />],
      ['FRIENDS', '好友', <IconFriends {...commonTabPaneProps} />],
      ['GROUPS', '群组', <IconGroups {...commonTabPaneProps} />],
    ];

    return (
      <div className={css(styles.navWrap)}>
        <div className={css(styles.header)} style={{backgroundColor: theme.mainColor}}>
          <TabBar
            underlineStyle={{borderColor: '#FFF', borderBottomWidth: 3}}
            activeKey={this.state.type.toUpperCase()}
            onSwitchKey={this.onSwitchTabHandle}>
            {
              tabs.map(item => (
                <TabPane
                  style={{display: 'flex', alignItems: 'center'}}
                  key={item[0]}
                  onClick={() => {this.setState({type: item[0]})}}>
                  {/*<span style={{color: '#FFF'}}>{item[1]}</span>*/}
                  <span style={{lineHeight: 4, flex: 1}}>{item[2]}</span>
                </TabPane>
              ))
            }
          </TabBar>
        </div>
        <div className={css(styles.center)}>
          {
            [
              {key: 'FRIENDS', style: {x: spring(type == 'FRIENDS'?1:0), zIndex: type=='FRIENDS'?1:0}},
              {key: 'RECENT', style: {x: spring(type == 'RECENT'?1:0), zIndex: type=='RECENT'?1:0}},
              {key: 'GROUPS', style: {x: spring(type == 'GROUPS'?1:0), zIndex: type=='GROUPS'?1:0}},
            ].map((item, i) =>
              <Motion key={i} style={item.style}>
                {
                  style => (
                    <div key={item.key} className={css(styles.centerWrap)} style={{
                      opacity: style.x,
                      zIndex: style.zIndex,
                      display: style.x == 0?'none':'block'
                    }}>
                      {
                        {
                          'RECENT': <Recent />,
                          'FRIENDS': <Friends />,
                          'GROUPS': <Groups/>
                        }[item.key]
                      }
                    </div>
                  )
                }
              </Motion>
            )
          }
        </div>
        <div className={css(styles.bottom)}>
          {/*搜索*/}
          <div className={css(styles.bottom__search, styles.bottom__btn)}>
            <span style={styles.bottom__btn__icon._definition}>
              <IconSearch width={bottom_btn_icon_size} height={bottom_btn_icon_size} />
            </span>
          </div>
          <div className={css(styles.bottom__btn)}>
            <Link to="/notification" title="通知" style={styles.bottom__btn__icon._definition}>
              <IconNotification width={bottom_btn_icon_size} height={bottom_btn_icon_size}  />
            </Link>
            {
              untreated == 0?
                null:
                <div className={css(styles.notification__num)}>{untreated}</div>
            }
          </div>
          <div className={css(styles.bottom__btn)}>
            <Link to="/add" title="添加好友" style={styles.bottom__btn__icon._definition}>
              <IconAdd  width={bottom_btn_icon_size} height={bottom_btn_icon_size} />
            </Link>
          </div>
          {/*<div className={css(styles.bottom__btn)}>*/}
            {/*<Link to="/theme" title="主题">*/}
              {/*<IconCloth  width={bottom_btn_icon_size} height={bottom_btn_icon_size} />*/}
            {/*</Link>*/}
          {/*</div>*/}
          {/*<div className={css(styles.bottom__btn)}>*/}
            {/*<Link to="/info" title="信息">*/}
              {/*<IconInfo  width={bottom_btn_icon_size} height={bottom_btn_icon_size} />*/}
            {/*</Link>*/}
          {/*</div>*/}

        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  navWrap: {
    paddingTop: 75,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 75,
    borderRadius: '8px 8px 0 0',
    backgroundColor: 'rgb(226, 112, 28)', // use theme
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,.16)'
  },
  center: {
    position: 'absolute',
    boxSizing: 'border-box',
    paddingTop: 75,
    paddingBottom: 44,
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    borderRadius: 8,
    overflowX: 'hidden',
    overflowY: 'auto'
  },

  bottom: {
    position: 'absolute',
    display: 'flex',
    bottom: 0,
    width: '100%',
    left: 0,
    height: 54,
    borderRadius: '0 0 8px 8px',
    backgroundColor: '#FFF',
    zIndex: 10,
  },

  bottom__search: {
    cursor: 'pointer'
  },

  bottom__btn: {
    // width: '20%',
    flex: 1,
    textAlign: 'center',
    lineHeight: '54px',
    flexDirection: 'row',
    alignItems: 'center',
    // float: 'left',
    display: 'flex',
    position: 'relative',
  },

  bottom__btn__icon: {
    flex: 1,
  },

  centerWrap: {
    position: 'absolute',
    overflow: "auto",
    left: 0,
    top: 75,
    right: 0,
    bottom: 44
  },
  notification__num: {
    position: 'absolute',
    top: 0,
    left: 60,
    color: '#FFF',
    backgroundColor: '#ff7105',
    borderRadius: '50px',
    fontSize: 12,
    width: 20,
    height: 20,
    lineHeight: '20px',
  }
});

export default module.exports = connect(
  (store) => ({
    account: store.account,
    messagelist: store.messagelist,
    theme: store.theme.current
  }),
  (dispatch) => bindActionCreators({
    getFriendList, push
  }, dispatch)
)(NavWrap)



