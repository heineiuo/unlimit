import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import NavBar from 'react-components/NavBar'
import Theme from './Theme'
import {StyleSheet, css} from 'aphrodite';
import * as API from 'youkuohao-sdk/gateway'
import * as AccountSDK from 'youkuohao-sdk/account'

class Master extends Component {

  state = {
    showBg: false
  };


  handleWheel = () => {
    this.updateBg()
  };

  updateBg = () => {
    const showBg = document.body.scrollTop > 0
    if (this.state.showBg != showBg) {
      this.setState({
        showBg: showBg
      })
    }
  };

  componentWillMount = () => {
    const {checkLogin} = this.props.actions
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
      <Theme>
        {
          !account.loginChecked?
            <div>loading</div>:
            <div
              className={css(styles.container)}
              onWheel={this.handleWheel}>
              <NavBar
                showBg={this.state.showBg}
                show={nav.currentId != 'id0'}
                rootId={nav.rootId}
                navMap={nav.navMap}
                currentId={nav.currentId} />
              {children}
            </div>
        }
      </Theme>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50
  }
});

export default module.exports = connect((state) => {
  return {
    account: state.account,
    nav: state.nav
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({
      checkLogin: () =>  async (dispatch, getState) => {
        try {
          const {userToken} = localStorage;
          if (!userToken) {
            return dispatch({
              type: "ACCOUNT_LOGIN_CHECKED",
              payload: {
                logged: false
              }
            })
          }
          const session = await AccountSDK.Session({token: userToken});
          if (session.error) throw session.error;
          dispatch({
            type: "ACCOUNT_LOGIN_CHECKED",
            payload: {
              logged: true,
              token: userToken
            }
          })
        } catch(e){
          dispatch({
            type: "ACCOUNT_LOGIN_CHECKED",
            payload: {
              logged: false
            }
          });

          alert(e)
        }

      }
    }, dispatch)
  }
})(Master)