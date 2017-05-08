import React, {Component} from "react"
import {Link, Route, Switch} from "react-router-dom"
import Body from "react-sea/lib/Body"
import {css, StyleSheet} from "aphrodite"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import HostList from "./DriveList"
import DriveHeader from "./DriveHeader"

class Drive extends Component {

  state = {
    showBg: false
  };

  render() {
    const {loginCheckState, logged, match, match: {params}} = this.props;
    return (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}}/>
        {
          loginCheckState < 2 ?
            <div>loading</div> :
            !logged ?
              <div>
                <Link to="/account">登录</Link>
              </div> :
              <div className={css(styles.container)}>
                <DriveHeader
                  match={match}
                  getHostList={this.props.getHostList}
                  deleteHost={this.props.deleteHost}
                  createHost={this.props.createHost}/>
                <Switch>
                  <Route exact path={`${match.path}`} component={HostList}/>
                  <Route path={`${match.path}/:driveId`} component={require('./DriveWrapper')}/>
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
    getHostList: require('../actions/drive/queryList').default,
    deleteHost: require('../actions/drive/mutateDeleteOne').default,
    createHost: require('../actions/drive/mutateInsertOne').default,
  }, dispatch),
  (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, dispatchProps, ownProps, {})
  }
)(Drive)


