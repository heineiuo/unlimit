import React, {Component} from 'react'
import SideNavLayout, {
  SideNav,
  SideNavItem,
  SideNavContent} from 'react-sea/lib/Layout/SideNavLayout'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {setTitle} from '../store/nav'

class HostDetail extends Component {

  componentWillMount = () => {
    this.props.setTitle('域名路由设置')
  };

  render(){
    const {hostname} = this.props.params;

    return (
      <SideNavLayout>
        <SideNav>
          <SideNavItem to={`/${hostname}/location`}>域名</SideNavItem>
          <SideNavItem to={`/${hostname}/file`}>文件管理</SideNavItem>
        </SideNav>
        <SideNavContent>
          {this.props.children}
        </SideNavContent>
      </SideNavLayout>
    )
  }
}


export default module.exports = connect(
  (store) => ({
    nav: store.nav
  }),
  (dispatch) => bindActionCreators({
    setTitle
  }, dispatch)
)(HostDetail)