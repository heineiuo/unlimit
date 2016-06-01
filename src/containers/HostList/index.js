import React, {Component} from 'react'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

import Card from '../../components/Card'
import Button from '../../components/Button'
import Paper from '../../components/Paper'

import Style from './style.scss'

class HostList extends Component {

  state = {
    page: 1
  }

  componentDidMount = ()=>{
    const {getHostList} = this.props.hostActions
    getHostList(this.state.page)
  }

  renderHostList = ()=>{

    const {hostList} = this.props.hostState

    console.log(hostList)

    const list = hostList.map((item, index)=>{
      return (
        <Card key={index}>
          <div className={Style.hostItem}>
            <Link to={`/host/${item._id}`}
                  style={{float: 'left'}}
            ><div>{item.hostname}</div>
            </Link>
            <div style={{float: 'left'}}>
              <Button type="danger" size="small">删除</Button>
            </div>
          </div>
        </Card>
      )
    })

    return list

  }

  render(){

    return (
      <div>

        <div className={Style.titlebar}>
          <div style={{float: 'left'}}>
            域名列表
          </div>
          <Link to="/host/new" style={{float: 'left'}}>
            <Button size="small">添加</Button>
          </Link>
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