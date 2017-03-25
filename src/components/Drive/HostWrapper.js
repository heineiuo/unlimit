import React, {Component, PropTypes} from 'react'
import Paper from 'react-sea/lib/Paper'
import {Switch, Route, Link } from 'react-router-dom'
import Spin from 'react-spin'
import {TabBar, TabPane} from 'react-sea/lib/Tabbar'
import {css, StyleSheet} from 'aphrodite/no-important'

import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {bindActionCreators} from 'redux'
import {
  createHost, getHostList, deleteHost,
  getLocations, commitLocations
} from '../../store/host'
import {restoreFileList, getFileList, deleteFile} from '../../store/file'
import {setTitle} from '../../store/nav'


class HostWrapper extends Component {

  state = {
    activeTab: 'file'
  };

  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount = () => {
    const {match: {params}, location: {pathname}} = this.props;

    const activeTab = pathname.search('/file')>0?'file':
      pathname.search('/location')>0?'location':
      pathname.search('/setting')>0?'setting':'file';

    this.setState({
      activeTab
    })
  };

  handleSwitchKey = (activeTab) => {
    const {match: {params}} = this.props;
    this.context.router.history.push(`/drive/${params.hostname}/${activeTab}`);
    this.setState({activeTab});
  };

  render (){
    const {children, host, match, match: {params}} = this.props;
    // console.log(host.hostListState);

    return (
      <div className={css(styles.wrapper)}>
        <Paper style={{boxShadow: 'none', padding: 0}} >
          <div className={css(styles.wrapper__header)}>
            <div style={{position: 'relative', height: 40, width: 320}}>
              <TabBar
                //style={{}}
                underlineStyle={{borderBottomWidth: 2, borderColor: '#e36209'}}
                activeKey={this.state.activeTab}
                onSwitchKey={this.handleSwitchKey}>
                <TabPane key="file" style={styles.tabPane._definition}>文件</TabPane>
                <TabPane key="location" style={styles.tabPane._definition}>路由</TabPane>
                <TabPane key="setting" style={styles.tabPane._definition}>设置</TabPane>
              </TabBar>
            </div>
            <div style={{lineHeight: '40px'}}>{params.hostname}</div>
          </div>
          <div className={css(styles.wrapper__body)}>
            {host.hostListState < 2?<Spin />: (
              <Switch>
                <Route exact path={'/drive/:hostname'} component={require('./File')}/>
                <Route path={`${match.path}/file`} component={require('./File')}/>
                <Route path={`${match.path}/location`} component={require('./Location')}/>
                <Route path={`${match.path}/setting`} component={require('./Setting')}/>
              </Switch>
            )}
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
  (state) => ({
    host: state.host,
  }),
  (dispatch) => bindActionCreators({
    push,
    setTitle,
    getHostList,
    restoreFileList
  }, dispatch)
)(HostWrapper);

export default module.exports = ConnectedWrapper
