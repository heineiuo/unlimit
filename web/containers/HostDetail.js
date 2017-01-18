import React, {Component} from 'react'
import SideNavLayout, {
  SideNav,
  SideNavItem,
  SideNavContent} from 'react-sea/lib/Layout/SideNavLayout'


class HostDetail extends Component {

  render(){

    const {hostname} = this.props.params;

    return (
      <SideNavLayout>
        <SideNav>
          <SideNavItem to={`/host/${hostname}/location`}>域名</SideNavItem>
          <SideNavItem to={`/host/${hostname}/file`}>文件管理</SideNavItem>
        </SideNav>
        <SideNavContent>
          {this.props.children}
        </SideNavContent>
      </SideNavLayout>
    )
  }
}


export default module.exports = HostDetail