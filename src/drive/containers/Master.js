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

  componentWillReceiveProps = (nextProps) => {
    const {account} = this.props;
    if (account.loginCheckState < 2 && nextProps.account.loginCheckState == 2) {
      if (!nextProps.account.logged) return location.href = '/account/#/?redirectTo=/drive'
    }
  };

  componentDidUpdate = () => {
    this.updateBg()
  };

  render(){
    const { account, children} = this.props;

    return (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />

        {
          account.loginCheckState < 2?
            <div>loading</div>:
            !account.logged?
              <div>redirecting...</div>:
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
  (store) => ({
    account: store.account,
    nav: store.nav
  }),
  (dispatch) => bindActionCreators({
    checkLogin
  }, dispatch)
)(Master)