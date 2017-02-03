import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {setTitle} from '../store/nav'
import {StyleSheet, css} from 'aphrodite/no-important'

class Header extends Component {

  render(){
    const {nav} = this.props;

    return (
      <div className={css(styles.headerBar)}>
        <div>
          <Link to="/">协作空间</Link>
        </div>
        <div>{nav.title}</div>
        <div>o</div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  headerBar: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    height: 56,
    // borderBottom: '1px solid #e2e2e2',
    backgroundColor: '#FFF',
    lineHeight: `${56}px`,
    marginBottom: 10,
  }
});

export default connect(
  (store) => ({
    nav: store.nav
  }),
  (dispatch) => bindActionCreators({
    setTitle
  }, dispatch)
)(Header)