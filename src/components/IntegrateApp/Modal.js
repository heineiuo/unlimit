import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import IntegrateApp from './index'

class IntegrateAppModal extends Component {


  render() {
    return (
      <div ref={div => this.mountPoint = div}/>
    )
  }
}

export default module.exports = IntegrateAppModal