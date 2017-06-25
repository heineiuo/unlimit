import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, css} from 'aphrodite/no-important'
import IconClose from '../componenets/Icons/IconClose'

class Groups extends Component {

  static defaultProps = {
    style: {}
  };
  render () {
    const {style,theme} = this.props;
    return (
      <div style={style}>
        <div className={css(styles.tipsBackground)}></div>
        <div className={css(styles.tipsContainer)}>
          <div className={css(styles.tipsTitle)} style={{backgroundColor: theme.mainColor,}}>
            <span style={{lineHeight: '35px'}}>信息提示</span>
            <IconClose fill="#FFF" width={35} height={35} className={css(styles.tipsCloseX)} style={{backgroundColor: theme.mainColor}} />
          </div>
          <div className={css(styles.tipsContent)} style={{color: theme.mainColor,}}>
            <p className={css(styles.tipsContentP)}>敬请期待！</p>
          </div>
          <div>
            <button className={css(styles.tipsCloseBtn)}>
              关闭
            </button>
          </div>
        </div>
      </div>
    )
  }
}
const styles = StyleSheet.create({
  tipsBackground: {
    minHeight: 471,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  tipsContainer: {
    position: 'absolute',
    top: '25%',
    right: '10%',
    width: '80%',
    height: '40%',
    backgroundColor: '#fff',
    minHeight: 170,
  },
  tipsTitle: {
    color: '#fff',
    // backgroundColor: theme.mainColor,
    fontSize: 16,
    fontWeight: 600,
    height: 35,
    paddingLeft: 10,
  },
  tipsCloseX: {
    float: 'right',
    // backgroundColor: theme.mainColor,
    ':hover': {
      opacity: .9,
    }
  },
  tipsContent: {
    // color: theme.mainColor,
    fontSize: 20,
    textAlign: 'center',
    height: '46%'
  },
  tipsContentP: {
    padding: '10%',
    fontSize: 22,
    fontWeight: 500
  },
  tipsCloseBtn: {
    width: 70,
    height: 32,
    float: 'right',
    marginRight: 10
  },
});

export default module.exports = connect(
  (store) => ({
    account: store.account,
    theme: store.theme.current
  })
)(Groups)