import React, {Component, PropTypes} from "react"
import Paper from "react-sea/lib/Paper"
import {Route, Switch} from "react-router-dom"
import {TabBar, TabPane} from "react-sea/lib/Tabbar"
import {css, StyleSheet} from "aphrodite"
import {connect} from "react-redux"
import {push} from "react-router-redux"
import {bindActionCreators} from "redux"
import AsyncTopic from "./Topic/AsyncTopic"

class DriveWrapper extends Component {

  state = {
    activeTab: 'file'
  };

  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount = () => {
    const {match: {params: {driveId}}, location: {pathname}, queryOne} = this.props;
    queryOne(driveId)

    const activeTab = pathname.search('/file') > 0 ? 'file' :
      pathname.search('/website') > 0 ? 'website' :
        pathname.search('/topics') > 0 ? 'topics' :
          pathname.search('/setting') > 0 ? 'setting' :
            pathname.search('/members') > 0 ? 'members' :
              'file';

    this.setState({
      activeTab
    })
  };

  handleSwitchKey = (activeTab) => {
    const {match: {params}} = this.props;
    this.context.router.history.push(`/drive/${params.driveId}/${activeTab}`);
    this.setState({activeTab});
  };

  render() {
    const {host, match, match: {params}, currentDriveName} = this.props;

    return (
      <div className={css(styles.wrapper)}>
        <Paper style={{boxShadow: 'none', padding: 0}}>
          <div className={css(styles.wrapper__header)}>
            <div style={{position: 'relative', height: '40px', maxWidth: '400px', width: '60%'}}>
              <TabBar
                underlineStyle={{borderBottomWidth: 2, borderColor: '#e36209'}}
                activeKey={this.state.activeTab}
                onSwitchKey={this.handleSwitchKey}>
                <TabPane key="file" style={styles.tabPane._definition}>文件</TabPane>
                <TabPane key="topics" style={styles.tabPane._definition}>主题</TabPane>
                <TabPane key="website" style={styles.tabPane._definition}>网站</TabPane>
                <TabPane key="members" style={styles.tabPane._definition}>成员</TabPane>
                <TabPane key="setting" style={styles.tabPane._definition}>设置</TabPane>
              </TabBar>
            </div>
            <div style={{lineHeight: '40px'}}>{currentDriveName}</div>
          </div>
          <div className={css(styles.wrapper__body)}>
            <Switch>
              <Route path={'/drive/:driveId'} exact component={require('./File/File')}/>
              <Route path={`${match.path}/file/:fileId`} component={require('./File/File')}/>
              <Route path={`${match.path}/file`} component={require('./File/File')}/>
              <Route path={`${match.path}/topics`} render={AsyncTopic}/>
              <Route path={`${match.path}/website`} component={require('./Website/Location')}/>
              <Route path={`${match.path}/members`} component={require('./Members')}/>
              <Route path={`${match.path}/setting`} component={require('./Setting')}/>
            </Switch>
          </div>
        </Paper>
      </div>
    )
  }

}

const styles = StyleSheet.create({
  wrapper: {
    margin: '0 auto',
    maxWidth: 1000,
    paddingTop: 20,
  },

  wrapper__header: {
    backgroundColor: '#FFF',
    borderBottom: '1px solid #EFEFF9',
    padding: '20px 20px 0',
    display: 'flex',
    justifyContent: 'space-between',
  },

  wrapper__body: {
    padding: 20,
  },

  tabPane: {
    fontSize: 14,
    lineHeight: '28px',
    letterSpacing: 4
  }
});


const ConnectedWrapper = connect(
  (store) => ({
    host: store.host,
    currentDriveName: store.host.currentDriveName
  }),
  (dispatch) => bindActionCreators({
    push,
    queryOne: require('../actions/drive/queryOne').default
  }, dispatch)
)(DriveWrapper);

export default module.exports = ConnectedWrapper
