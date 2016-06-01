import React, {Component} from 'react'
import {Link} from 'react-router'
import Paper from '../../components/Paper'
import Button from '../../components/Button'
import Input from '../../components/Input'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class HostNew extends Component {


  render(){

    const {currentHost} = this.props.hostState


    return (
      <Paper>

        <div className="title">添加一个域名</div>

        <div className="host-new-wrap">

          <div className="form form-horizontal">

            <div className="form-group">
              <div className="col-sm-4">
                <Input label="域名"
                       name="hostname"
                       id="input-hostname"
                       type="text"
                       placeholder="请输入域名"  />
              </div>
            </div>

            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-4 form-error"></div>
            </div>

            <div className="form-group">
              <div style={{width: 100}}>
                <Button
                >提交</Button>
              </div>
            </div>

          </div>
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
)(HostNew)