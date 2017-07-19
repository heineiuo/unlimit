import React, {Component, PropTypes} from "react"
import Paper from "react-sea/lib/Paper"
import {Route, Switch, Link} from "react-router-dom"
import {TabBar, TabPane} from "react-sea/lib/Tabbar"
import {css, StyleSheet} from "aphrodite"
import {connect} from "react-redux"
import {push} from "react-router-redux"
import {bindActionCreators} from "redux"
import AsyncTopic from './AsyncTopic'

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

    const tabs = ['file', 'website', 'topics', 'setting', 'services', 'members', 'files']
    const activeTabIndex = tabs.findIndex(item => {
      return pathname.search(`/${item}`) > 0
    })
    if (activeTabIndex > -1) {
      this.setState({
        activeTab: tabs[activeTabIndex]
      })
    }

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
                {/*<TabPane key="topics" style={styles.tabPane._definition}>主题</TabPane>*/}
                <TabPane key="website" style={styles.tabPane._definition}>网站</TabPane>
                <TabPane key="members" style={styles.tabPane._definition}>成员</TabPane>
                <TabPane key="services" style={styles.tabPane._definition}>服务</TabPane>
                <TabPane key="topic" style={styles.tabPane._definition}>文章</TabPane>
                <TabPane key="setting" style={styles.tabPane._definition}>设置</TabPane>
              </TabBar>
            </div>
            <div style={{lineHeight: '40px'}}>{currentDriveName}</div>
          </div>
          <div className={css(styles.wrapper__body)}>
            <Switch>
              <Route path={'/drive/:driveId'} exact component={require('./File/File').default}/>
              <Route path={`${match.path}/file/:fileId`} component={require('./File/File').default}/>
              <Route path={`${match.path}/file`} component={require('./File/File').default}/>
              <Route path={`${match.path}/services`}>
                <div>
                </div>
              </Route>
              <Route path={`${match.path}/topic`} component={AsyncTopic} />
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
    host: store.drive,
    currentDriveName: store.drive.currentDriveName
  }),
  (dispatch) => bindActionCreators({
    push,
    queryOne: require('../actions/drive/queryOne').default
  }, dispatch)
)(DriveWrapper);

export default module.exports = ConnectedWrapper
