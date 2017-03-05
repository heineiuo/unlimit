import React, {Component, PropTypes} from 'react'
import Paper from 'react-sea/lib/Paper'
import { Link } from 'react-router'
import Spin from 'react-spin'
import {TabBar, TabPane} from 'react-sea/lib/Tabbar'

class HostWrapper extends Component {

  state = {
    activeTab: 'file'
  };

  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount = () => {
    const {params, location: {pathname}} = this.props;

    const activeTab = pathname.search('/file')>0?'file':
      pathname.search('/location')>0?'location':
      pathname.search('/setting')>0?'setting':'file';

    this.setState({
      activeTab
    })
  };

  handleSwitchKey = (activeTab) => {
    const {params} = this.props;
    this.context.router.push(`/drive/${params.hostname}/${activeTab}`);
    this.setState({activeTab});
  };

  render (){
    const {children, host, params} = this.props;
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
          {host.hostListState < 2?<Spin />: children}
        </Paper>
      </div>
    )
  }

}


export default module.exports = HostWrapper

