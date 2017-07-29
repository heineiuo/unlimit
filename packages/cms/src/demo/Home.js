import React, {Component} from 'react'
import SideLeft from './SideLeft'
import SideRight from './SideRight'
import {Link} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'

class Home extends Component {

  static defaultProps = {
    staticPath: ""
  };

  render (){
    const {staticPath} = this.props;
    return (
      <div className={css(styles.row)}>
        <div className={css(styles.col3)}>
          <SideLeft />
        </div>
        <div className={css(styles.col6)}>
          <div className={css(styles.block)}>
            <div className={css(styles.title)}>
              关于我们
              <div className={css(styles.pullRight)}>
              </div>
            </div>
            <div className={css(styles.content)}>
              xxx
              <br/>
              xxx
            </div>
          </div>

        </div>
        <div className={css(styles.col3)}>
          <SideRight />
        </div>
      </div>
    );


  }
}

const styles = StyleSheet.create({
  ...commonStyle,


  title: {
    position: 'absolute',
    top: 0,
    width: 160,
    left: '50%',
    marginLeft: -80,
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 50,
    color: '#669f36',
    height: 50,
    backgroundColor: '#fff',
  },

  content: {
    padding: 10,
    color: '#669f36'
  }
});

export default module.exports = connect(
  (store) => ({
    account: store.account,
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Home);
