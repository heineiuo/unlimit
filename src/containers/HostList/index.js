import React, {Component} from 'react'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class HostList extends Component {

  state={
    page: 1
  }

  componentDidMount =()=>{
    const {getHostList} = this.props.hostActions
    getHostList(this.state.page)
  }

  renderHostList =()=>{

    const {hostList} = this.props.hostState

    const list = hostList.map((item, index)=>{
      return (
        <tr key={index}>
          <td><code>{item.hostname}</code></td>
          <td>
            <div className="btn-group">
              <a href="{{conf.hrefPrefix}}/host/{{item._id}}" className="btn btn-xs  btn-primary">详情</a>
            </div>
          </td>
        </tr>
      )
    })

    return list

  }

  render(){

    return (
      <div className="container width-max">
        <div className="paper">
          <div className="title">
            <h4 className="">
              域名列表
              <small style={{marginLeft: 20}}>
                <Link
                  to="/host/new"
                  className="btn btn-xs btn-primary"
                >
                  添加
                </Link>
              </small>
            </h4>
          </div>
          <div className="host-list">

            <table className="table">
              <thead>
              <tr>
                <th>hostname</th>
                <th>操作</th>
              </tr>
              </thead>

              <tbody>

                {this.renderHostList()}
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
)(HostList)