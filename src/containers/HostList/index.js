import React, {Component} from 'react'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

import Card from '../../components/Card'
import Button from '../../components/Button'

import Style from './style.scss'


class HostList extends Component {

  state = {
    page: 1
  }

  componentDidMount =()=>{
    const {getHostList} = this.props.hostActions
    getHostList(this.state.page)
  }

  renderHostList =()=>{

    const {hostList} = this.props.hostState

    console.log(hostList)

    const list = hostList.map((item, index)=>{
      return (
        <Card key={index}>
          <div>{item.hostname}</div>
          <div>
            <div className="btn-group">
              <Link to={`/host/${item._id}`}>
                <Button>详情</Button>
              </Link>
            </div>
          </div>
        </Card>
      )
    })

    return list

  }

  render(){

    return (
      <div className="container width-max">

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

        <div className={Style.hostList}>
          {this.renderHostList()}
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