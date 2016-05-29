import React, {Component} from 'react'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class HostDetail extends Component {

  componentDidMount =()=>{
    const {hostActions, params} = this.props
    console.log(params.host_id)
    hostActions.getHostLocationList(params.host_id)
  }

  renderLocationList = ()=>{

    const {locationList, currentHost} = this.props.hostState
    if (locationList.length==0) {
      return (
        <tr colSpan="4">没有location</tr>
      )
    }
    return locationList.map(location=>{
      return (
        <tr key={location._id}
            data-hostId="{item.hostId}"
            data-locationId="{item._id}">
          <td><code>{location.pathname}</code></td>
          <td>
            <div className="btn-group">
              <button className="btn btn-default btn-xs"
                      data-updatesort="up"
                      data-sort="{item.sort}">
                <i className="glyphicon glyphicon-menu-up"> </i>
              </button>
              <button className="btn btn-default btn-xs">{location.sort}</button>
              <button className="btn btn-default btn-xs"
                      data-updatesort="down"
                      data-sort="{item.sort}">
                <i className="glyphicon glyphicon-menu-down"> </i>
              </button>
            </div>
          </td>
          <td><code>{location.type}</code></td>
          <td>
            <div className="btn-group">
              <Link to={`/host/${currentHost._id}/location/${location._id}`}
                    className="btn btn-xs  btn-primary">详情</Link>
            </div>
          </td>
        </tr>
      )
    })

  }

  render(){

    const {
      loadingLocationList,
      currentHost
    } = this.props.hostState


    if (loadingLocationList){
      return (
        <div>正在加载</div>
      )
    }

    return (
      <div className="container width-max" >

        <div className="paper">

          <div className="title clearfix">
            <div className="h4">
              <Link to={`/host/${currentHost._id}`}>{currentHost.hostname}</Link>
              <small className="pull-right">
                <button
                  className="btn btn-xs btn-danger"
                  id="deleteHost">删除</button>
              </small>
            </div>
          </div>

          <div className="h5">
            location列表
            <small>
              <Link to={`/host/${currentHost._id}/location/new`}
                 className="btn btn-xs btn-primary">新建</Link>
            </small>
          </div>

          <div className="location-list">
            <table className="table table-hoverd">

              <thead>
              <tr>
                <th>pathname</th>
                <th>优先级</th>
                <th>类型</th>
                <th>操作</th>
              </tr>
              </thead>

              <tbody>
              { this.renderLocationList()}
              </tbody>

            </table>
          </div>

        </div>


      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    hostState: state.host
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(HostActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HostDetail)