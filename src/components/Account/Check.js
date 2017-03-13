import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Logged from "./Logged"
import UnLogged from './Unlogged'
import Spin from 'react-spin'
import Header from './Header'
import Body from 'react-sea/lib/Body'
import {logout, checkLogin, sendVerifyCode, getAuthCodeAndRedirect} from '../../store/account'

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
    // console.log(location);
    checkLogin(location.search.redirectUrl)
  };

  componentWillUpdate = () => {
    const {account, getAuthCodeAndRedirect} = this.props;
    if (account.logged && this.props.location.query.redirectTo > 0) {
      // getAuthCodeAndRedirect();
      this.props.push(this.props.location.query.redirectTo)
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const {account, location} = this.props;
    if (nextProps.account.logged && location.query.redirectTo) {
      if (
        (!account.loginChecked && nextProps.account.loginChecked) ||
        !account.logged
      ) {
        window.location.href = location.query.redirectTo;
      }
    }

  };

  switchPane = (target) => {
    this.setState({
      view: target
    })
  };

  render (){
    const {account, logout, sendVerifyCode} = this.props;

    return (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />
        {
          !account.loginChecked? (
            <div>
              <Spin />
            </div>
          ): (
            <div>
              <Header />
              {
                account.logged ?
                  <Logged logout={logout} account={account}/> :
                  <UnLogged sendVerifyCode={sendVerifyCode} account={account}/>
              }
            </div>
          )
        }
      </div>
    )
  }
}


export default module.exports = connect(
  (store) => ({
    account: store.account,
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Check)