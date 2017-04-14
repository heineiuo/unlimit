import React, {Component} from 'react'
import {Switch, Route, Redirect, Link} from 'react-router-dom'
import DriveHeader from './DriveHeader'
import Body from 'react-sea/lib/Body'
import {StyleSheet, css} from 'aphrodite'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {bindActionCreators} from 'redux'
import HostList from './DriveList'

class Master extends Component {

  state = {
    showBg: false
  };

  render(){
    const { loginCheckState, logged, match, match: {params}} = this.props;
    return (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />
        {
          loginCheckState < 2?
            <div>loading</div>:
            !logged?
              <div>
                <Link to="/account">登录</Link>
              </div>:
              <div className={css(styles.container)}>
                <DriveHeader
                  getHostList={this.props.getHostList}
                  deleteHost={this.props.deleteHost}
                  createHost={this.props.createHost}/>
                <Switch>
                  <Route exact path={`${match.path}`} component={HostList}/>
                  <Route path={`${match.path}/:driveId`} component={require('./DriveWrapper')} />
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
    loginCheckState: store.account.loginCheckState,
    logged: store.account.logged,
    nav: store.nav
  }),
  (dispatch) => bindActionCreators({
    getHostList: require('../../actions/host/getHostList'),
    deleteHost: require('../../actions/host/deleteHost'),
    createHost: require('../../actions/host/createHost'),
  }, dispatch),
  (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, dispatchProps, ownProps, {})
  }
)(Master)


