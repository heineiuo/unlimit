import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Header from './Header'
import Body from 'react-sea/lib/Body'
import {StyleSheet, css} from 'aphrodite'
import {checkLogin} from '../store/account'

class Master extends Component {

  state = {
    showBg: false
  };

  handleWheel = () => {
    this.updateBg()
  };

  updateBg = () => {
    const showBg = document.body.scrollTop > 0;
    if (this.state.showBg != showBg) {
      this.setState({
        showBg: showBg
      })
    }
  };

  componentWillMount = () => {
    const {checkLogin} = this.props;
    checkLogin();
  };

  componentWillUpdate = () => {
    const {account} = this.props;
    if (account.loginChecked && !account.logged) return location.href = '/account'
  };

  componentDidUpdate = () => {
    this.updateBg()
  };

  render(){
    const {nav, account, children} = this.props;

    return (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />

        {
          !account.loginChecked?
            <div>loading</div>:
            <div
              className={css(styles.container)}
              onWheel={this.handleWheel}>
              <Header />
              {children}
            </div>
        }
      </div>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50
  }
});

export default module.exports = connect(
  (state) => ({
    account: state.account,
    nav: state.nav
  }),
  (dispatch) => bindActionCreators({
    checkLogin
  }, dispatch)
)(Master)