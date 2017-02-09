import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {setTitle} from '../store/nav'
import { getHostList,switchHost} from '../store/host'
import { restoreFileList} from '../store/file'
import Spin from 'react-spin'

class HostWrapper extends Component {

  componentWillMount = () => {
    const {getHostList, params} = this.props;
    getHostList(params.hostname);
  };

  componentWillReceiveProps = (nextProps) => {
    const {push, switchHost, restoreFileList} = this.props;
    if (nextProps.host.hostListState == 2) {
      if (!nextProps.params.hostname) return push(`/${nextProps.host.hostDefault}`);
      if (!this.props.params.hostname) return push(`/${nextProps.host.hostDefault}`)
      if (nextProps.params.hostname != this.props.params.hostname) {
        switchHost(nextProps.params.hostname);
        restoreFileList()
      }
    }
  };

  render (){
    const {host} = this.props;
    return host.hostListState == 2 ? this.props.children: <Spin />;
  }

}

module.exports = connect(
  (state) => ({
    host: state.host,
  }),
  (dispatch) => bindActionCreators({
    push,
    switchHost,
    setTitle,
    getHostList,
    restoreFileList,
  }, dispatch)
)(HostWrapper);