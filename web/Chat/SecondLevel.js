import React, {Component} from 'react'
import {Link} from 'react-router'
import {css, StyleSheet} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {goBack} from 'react-router-redux'
import IconArrowBack from '../componenets/Icons/IconArrowBack'

class SecondLevel extends Component {

  render () {
    const {children, location, goBack, theme} = this.props;
    const {pathname} = location;

    return (
      <div className={css(styles.SecondLevel)}>
        <div className={css(styles.header)} style={{backgroundColor: theme.mainColor}}>
          <div onClick={goBack} className={css(styles.header__back)}>
            <IconArrowBack style={{marginTop: -4, marginLeft: -6}} width={28} height={28} fill='#FFFFFF' />
            <span style={{color: '#FFF', fontSize: 18}}>返回</span>
          </div>
          <span className={css(styles.header__title)}>
            {
              {
                '/add': '添加',
                '/info': '提示',
                '/theme': '主题',
                '/notification': '通知',
              }[pathname] || ''
            }
          </span>
        </div>

        <div className={css(styles.center)}>
          {children}
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
    bottom: 0,
    width: '100%',
    borderRadius: 8,
    overflowY: 'auto',
    overflowX: 'hidden',
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
    height: 44,
    borderRadius: '0 0 8px 8px',
    backgroundColor: '#FFF',
    zIndex: 10,
  }
});

export default module.exports = connect(
  (store) => ({
    theme: store.theme.current
  }),
  (dispatch) => bindActionCreators({
    goBack
  }, dispatch)
)(SecondLevel)