import React, {Component} from 'react'
import {Switch, Route, Redirect, Link} from 'react-router-dom'
import Header from './Header'
import Body from 'react-sea/lib/Body'
import {StyleSheet, css} from 'aphrodite'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {bindActionCreators} from 'redux'
import HostList from './HostList'

import  {
  createHost, getHostList, deleteHost,
  getLocations, commitLocations
} from '../../store/host'
import {restoreFileList, getFileList, deleteFile} from '../../store/file'
import {setTitle} from '../../store/nav'


class Master extends Component {

  state = {
    showBg: false
  };

  // handleWheel = () => {
  //   this.updateBg()
  // };

  // updateBg = () => {
  //   const showBg = document.body.scrollTop > 0;
  //   if (this.state.showBg != showBg) {
  //     this.setState({
  //       showBg: showBg
  //     })
  //   }
  // };

  componentWillMount = () => {
    const {getHostList, match, host} = this.props;
    if (host.hostListState == 0) getHostList(match.params.hostname);
  };

  componentWillUnmount = () => {
    console.error('unmounting drive master')
  };

  // componentDidUpdate = () => {
  //   this.updateBg()
  // };

  render(){
    const { account, children, match, nav, createHost, host, getHostList, deleteHost} = this.props;

    return (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />

        {
          account.loginCheckState < 2?
            <div>loading</div>:
            !account.logged?
              <div>
                <Link to="/account">登录</Link>
              </div>:
              <div
                className={css(styles.container)}
               // onWheel={this.handleWheel}
              >
                <Header
                  host={host}
                  getHostList={getHostList}
                  deleteHost={deleteHost}
                  nav={nav}
                  createHost={createHost}/>
                <Switch>
                  <Route exact path={`${match.path}`} component={HostList}/>
                  <Route path={`${match.path}/:hostname`} component={require('./HostWrapper')} />
                </Switch>
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
    host: store.host,
    nav: store.nav
  }),
  (dispatch) => bindActionCreators({
    getHostList,
    deleteHost,
    createHost
  }, dispatch),
  (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, dispatchProps, ownProps, {
    })
  }
)(Master)


