import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Logged from "./Logged"
import UnLogged from './Unlogged'
import Spin from 'react-spin'
import {checkLogin, getAuthCodeAndRedirect} from '../store/account'

class Check extends Component {

  static defaultProps = {
    account: {},
    checkLogin: () => {},
    getAuthCodeAndRedirect: () => {}
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    view: 'login'
  };

  componentWillMount = () => {
    const {checkLogin, location} = this.props;
    console.log(location);
    checkLogin(location.search.redirectUrl)
  };

  componentWillUpdate = () => {
    const {account, getAuthCodeAndRedirect} = this.props;
    if (account.logged && account.redirectUrl.length > 0) {
      getAuthCodeAndRedirect();
    }
  };

  switchPane = (target) => {
    this.setState({
      view: target
    })
  };

  render (){
    const {account} = this.props;
    return (
      <div>
        {
          !account.loginChecked?
            <div>
              <Spin />
            </div>:
            account.logged && account.redirectUrl.length > 0?
              <div>Redirecting..</div>:
              account.logged?
                <Logged />:
                <UnLogged />
        }
      </div>
    )
  }
}


export default module.exports = connect(
  (state) => ({
    account: state.account
  }),
  (dispatch) => bindActionCreators({
    checkLogin, getAuthCodeAndRedirect
  }, dispatch)
)(Check)