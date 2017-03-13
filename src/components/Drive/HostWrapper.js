import React, {Component, PropTypes} from 'react'
import Paper from 'react-sea/lib/Paper'
import {Switch, Route, Link } from 'react-router-dom'
import Spin from 'react-spin'
import {TabBar, TabPane} from 'react-sea/lib/Tabbar'

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
    console.log(host.hostListState);

    return (
      <div style={{padding: '20px 0', margin: '0 auto', maxWidth: 1000}}>
        <Paper style={{boxShadow: 'none'}}>
          <div>{params.hostname}</div>
          <div style={{position: 'relative', height: 40, width: 400}}>
            <TabBar style={{}} activeKey={this.state.activeTab} onSwitchKey={this.handleSwitchKey}>
              <TabPane key="file">文件</TabPane>
              <TabPane key="location">路由</TabPane>
              <TabPane key="setting">设置</TabPane>
            </TabBar>
          </div>
          {host.hostListState < 2?<Spin />: (
            <Switch>
              <Route exact path={'/drive/:hostname'} component={require('./HostFile')}/>
              <Route path={`${match.path}/file`} component={require('./HostFile')}/>
              <Route path={`${match.path}/location`} component={require('./Location')}/>
              <Route path={`${match.path}/setting`} component={require('./Setting')}/>
            </Switch>
          )}
        </Paper>
      </div>
    )
  }

}



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
