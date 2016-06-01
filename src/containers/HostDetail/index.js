import React, {Component} from 'react'
import {Link} from 'react-router'
import Paper from '../../components/Paper'
import Button from '../../components/Button'
import Input from '../../components/Input'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

import Style from './style.scss'

class HostDetail extends Component {

  componentDidMount =()=>{
    const {hostActions, params} = this.props
    console.log(params.host_id)
    hostActions.getHostLocationList(params.host_id)
  }

  renderLocationList = ()=>{

    const {locationList, host} = this.props.hostState
    if (locationList.length==0) {
      return (
        <div>路由列表为空</div>
      )
    }
    
    const trs = locationList.map(location=>{
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
              <Link to={`/host/${host._id}/location/${location._id}`}
                    className="btn btn-xs  btn-primary">详情</Link>
            </div>
          </td>
        </tr>
      )
    })

    return (

      <table className="table table-hoverd">
        <thead>
        <tr>
          <th>路由</th>
          <th>优先级</th>
          <th>类型</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
          {trs}
        </tbody>
      </table>
    )

  }

  render(){

    const {
      loadingLocationList,
      host
    } = this.props.hostState

    if (loadingLocationList){
      return (
        <div>正在加载</div>
      )
    }

    return (
      <Paper>

        <div className={Style.titlebar}>
          <Link to={`/host/${host._id}`}
                style={{float: 'left'}}>{host.hostname}</Link>
        </div>

        <div className={Style.titlebar}>
          <div style={{float: 'left'}}>路由列表</div>
          <Link to={`/host/${host._id}/location/new`}
                style={{float: 'left'}}>
            <Button type="primary" size="small">新建</Button>
          </Link>
        </div>

        <div className="location-list">
          { this.renderLocationList()}
        </div>

      </Paper>

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