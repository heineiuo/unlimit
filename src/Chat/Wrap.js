import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite/no-important'
import {Link} from 'react-router'
import IconChat from '../componenets/Icons/Chat'
import ClickOutside from '../componenets/ClickOutside'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {startIM} from '../store/ws'
import {accountInit, login} from '../store/account'
import Login from './Login'
import Spin from 'react-spin'
import IconClose from '../componenets/Icons/IconClose'
import {Motion, spring} from 'react-motion'
import {toggleOpen} from '../store/display'

class Wrap extends Component {

  toggleOpened = () => {
    this.props.toggleOpen()
  };


  shouldCloseWindowTimerStart = () => {

    clearInterval(this.shouldCloseWindowTimer);

    const {toggleOpen} = this.props;
    let lastUserActionTime = Date.now();

    const updateLastUserActionTime = () => {
      lastUserActionTime = Date.now();
    };

    window.addEventListener('mousemove', updateLastUserActionTime, false);
    window.addEventListener('keydown', updateLastUserActionTime, false);
    document.addEventListener('visibilitychange', function(){
      if ( document.hidden) toggleOpen(false)
    });

    const t = this.shouldCloseWindowTimer = setInterval(() => {
      if (Date.now() - lastUserActionTime > 20 * 1000) {
        toggleOpen(false)
      }
    }, 1000)


  };

  componentWillMount = () => {
    const {ws, startIM, accountInit } = this.props;
    accountInit();
    if (process.env.NODE_ENV == 'production') this.shouldCloseWindowTimerStart()
  };

  componentDidUpdate = () => {
    const {ws, account, startIM, accountInit} = this.props;
    if (account.logged && ws.ws_state == 0) startIM()
  };

  getUnReadMessage = () => {
    const {messagelist} = this.props;
    let badgeNumber = 0;
    messagelist.list.map(item => {
      badgeNumber += item.unReadNumber
    });
    if (process.env.NODE_ENV == 'development') console.log(badgeNumber);
    if (badgeNumber < 99) return {chatIconSize: 26, badgeNumber};
    if (badgeNumber < 999) return {chatIconSize: 22, badgeNumber: '99+'};
    return {chatIconSize: 22, badgeNumber: '1k+'};
  };

  closeWindow = () => {
    const {toggleOpen} = this.props;
    toggleOpen(false)
  };

  render () {
    const {children, location, routing, account, opened, theme} = this.props;
    const justifyHeight = window.innerHeight - 160;
    const {chatIconSize, badgeNumber} = this.getUnReadMessage();

    return (
      <ClickOutside className={css(styles.wrap)} onClickOutside={this.closeWindow}>
        <div className={css(styles.button)} style={{backgroundColor: theme.mainColor}} onClick={this.toggleOpened}>
          <Motion style={{x: spring(opened ? 1 : 0, {stiffness: 250, damping: 26})}}>
            {({x}) =>
              <div>
                <div className={css(styles.button__icon)} style={{
                  opacity: x,
                  WebkitTransform: `rotate(${-(1-x)*90}deg) scale(${x})`,
                  transform: `rotate(${-(1-x)*90}deg) scale(${x})`
                }}>
                  <IconClose fill="#FFF" width={35} height={35} />
                </div>
                <div className={css(styles.button__icon)} style={{
                  opacity: 1-x,
                  WebkitTransform: `rotate(${x*90}deg) scale(${1-x})`,
                  transform: `rotate(${x*90}deg) scale(${1-x})`
                }}>
                  <IconChat fill="#FFF" width={chatIconSize} height={chatIconSize} />
                  {
                    badgeNumber == 0?
                      null:
                      <div className={css(styles.button__badge)} style={{
                        opacity: x==1?0:1
                      }}>{badgeNumber}</div>
                  }
                </div>
              </div>
            }
          </Motion>
        </div>
        <Motion style={{x: spring(opened ? 1 : 0, {stiffness: 250, damping: 25})}}>
          {({x}) =>
            <div
              className={css(styles.opened)}
              style={{
                display: x == 0? 'none': 'block',
                transform: `translateY(${(1-x) * 10}px)`,
                opacity: x,
                height: justifyHeight > 600?600:justifyHeight
              }}>
              {
                !account.loginChecked?
                  <Spin />:
                  account.logged?
                    children:
                    process.env.NODE_ENV=='development'?
                      <Login />:
                      <div>请先在 <a target="_blank" href="https://www.258m.com/">www.258m.com</a>登录</div>
              }
            </div>
          }
        </Motion>
      </ClickOutside>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    zIndex: 2000,
  },
  button: {
    position: 'absolute',
    display: 'block',
    right: 20,
    bottom: 20,
    lineHeight: '60px',
    textAlign: 'center',
    width: 60,
    height: 60,
    transition: 'box-shadow 80ms ease-in-out',
    boxShadow: '0 1px 6px rgba(0,0,0,.06),0 2px 32px rgba(0,0,0,.16)',
    backgroundColor: 'rgb(226, 112, 28)', // replace with theme
    borderRadius: 60,
    ':hover': {
      boxShadow: '0 1px 6px rgba(0,0,0,.06),0 2px 32px rgba(0,0,0,.36)',
    }
  },

  button__badge: {
    // position: 'absolute',
    // height: 14,
    // lineHeight: '14px',
    color: '#FFF',
    fontSize: 14,
  },

  button__icon: {
    position: 'absolute',
    width: 60,
    height: 60,
    display : 'flex',
    alignItems : 'center',
    justifyContent: 'center',
    // width: 40,
    // top: 10,
    // left: 10,
    // height: 40
  },
  opened: {
    position: 'absolute',
    bottom: 100,
    borderRadius: 8,
    right: 20,
    width: 370,
    height: 590,
    // backgroundColor: '#FFF',
    boxShadow: '0 5px 40px rgba(0,0,0,.16)',
    backgroundColor: '#F8f8f8',
    backgroundSize: '370px auto',
    backgroundImage: `url(${require('./images/background-1@2x.png')})`,
  }
});

export default module.exports = connect(
  (store) => ({
    opened: store.display.opened,
    messagelist: store.messagelist,
    routing: store.routing,
    ws: store.ws,
    theme: store.theme.current,
    account: store.account
  }),
  (dispatch) => bindActionCreators({
    startIM,
    accountInit,
    login,
    toggleOpen,
  }, dispatch)
)(Wrap)