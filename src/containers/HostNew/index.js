import React, {Component} from 'react'
import {Link} from 'react-router'
import Paper from '../../components/Paper'
import Button from '../../components/Button'
import Input from '../../components/Input'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class HostNew extends Component {

  state = {
    hostName: '',
    errorContent: '',
  }

  // static defaultProps = {
  //   createHost: () => {console.log('LOST_PROPS: createHost()')}
  // }

  createHost = () => {
    this.props.hostActions.createHost(this.state)
  }

  render(){
    return (
      <Paper>
        <div>添加一个域名</div>
        <div>
          <Input label="域名"
                 name="hostname"
                 id="input-hostname"
                 type="text"
                 onChange={(e)=>{this.setState({hostName: e.target.value})}}
                 value={this.state.hostName}
                 placeholder="请输入域名"  />
          <div>{this.state.errorContent}</div>
          <div style={{width: 100}}>
            <Button onClick={this.createHost}>提交</Button>
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