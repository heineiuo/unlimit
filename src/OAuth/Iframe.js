import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

// window.addEventListener('message', (e) => {
//   postMessage({
//     token: localStorage.token || localStorage.userToken || 'no token'
//   })
// }, false);

class Iframe extends Component {

  target = {
    source: null,
    origin: null
  };

  onStorage = (e) => {
    if (e.key === 'messageReadState' && this.target.source) {
      const data = {
        key: 'messageReadState',
        value: JSON.parse(e.newValue)
      };
      this.target.source.postMessage(data, target.origin)
    }
  };

  onMessage = (e) => {
    const {data, source, origin} = e;
    this.target.source = source;
    this.target.origin = origin;
    if (data.key === 'messageReadState') {
      localStorage.setItem(data.key, JSON.stringify(data.value))
    }

    if (data.type === 'REQUEST_TOKEN') {
      source.postMessage({
        type: 'RESPONSE_REQUEST_TOKEN',
        callbackId: data.callbackId,
        token: this.props.account.token
      }, origin)
    }
  }

  componentWillMount = () => {
    if (window.parent) window.parent.postMessage({status: 'iframe mount'}, '*');
    // window.addEventListener("storage", this.onStorage);
    window.addEventListener("message", this.onMessage, false);
  }

  componentWillUnmount = () => {
    // window.removeEventListener('storage', this.onStorage);
    window.removeEventListener("message", this.onMessage, false);
  }

  render () {
    return null
  }
}



export default module.exports = connect(
  (store) => ({
    account: store.account
  }),
  (dispatch) => bindActionCreators({

  }, dispatch)
)(Iframe)