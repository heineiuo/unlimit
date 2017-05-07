import React, {Component, PropTypes} from 'react'
import Header from './Header'
import Paper from 'react-sea/lib/Paper'
import Body from 'react-sea/lib/Body'
import Spin from 'react-spin'
import {TabBar, TabPane} from 'react-sea/lib/Tabbar'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Switch, Route} from 'react-router-dom'

import Bot from './Bot'
import Users from './Users'
import IntegrateApp from './IntegrateApp'

import {fetchUserList} from '../store/admin'

/**
 * 集成APP
 * 用户
 * TAG
 * 消息
 * 空间
 */

class Admin extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    activeTab: 'file'
  };

  componentWillMount = () => {
    const {location, location: {pathname}} = this.props;

    const lastParam = location.pathname.split('/').reverse()[0];
    const activeTab = ['service', 'users', 'tags', 'drive', 'messages',
      ].indexOf(lastParam) > -1 ?lastParam:'users';

    this.setState({
      activeTab
    })
  };

  handleSwitchKey = (activeTab) => {
    console.log(this.props);
    this.context.router.history.push(`/console/${activeTab}`);
    this.setState({activeTab});
  };

  render () {

    const {children, account, getTitle, match} = this.props;

    return (
      <div style={{paddingTop: 65}}>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />
        <Header getTitle={getTitle} />
        <Paper style={{boxShadow: 'none'}}>
          <div>管理面板</div>
          <div style={{position: 'relative', height: 40, width: 400}}>
            <TabBar activeKey={this.state.activeTab} onSwitchKey={this.handleSwitchKey}>
              <TabPane key="service">服务</TabPane>
              <TabPane key="users">用户</TabPane>
              <TabPane key="drive">空间</TabPane>
              <TabPane key="tags">标签</TabPane>
              <TabPane key="messages">消息</TabPane>
            </TabBar>
          </div>
          {
            !account.loginChecked?<Spin /> :
              <Switch>
                <Route path={`${match.path}/service`} component={Bot}/>
                <Route path={`${match.path}/users`} component={Users}/>
                <Route path={`${match.path}/tags`} component={IntegrateApp}/>
                <Route path={`${match.path}/drive`} component={IntegrateApp}/>
                <Route path={`${match.path}/messages`} component={IntegrateApp}/>
              </Switch>
          }
        </Paper>
      </div>
    )
  }
}



export default module.exports = connect(
  (store) => ({
    admin: store.admin,
    account: store.account
  }),
  (dispatch) => bindActionCreators({
    fetchUserList
  }, dispatch)
)(Admin)