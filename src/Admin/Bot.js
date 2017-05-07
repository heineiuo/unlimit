import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Button from 'react-sea/lib/Button'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class Bot extends Component {

  render () {

    return (
      <div>
        <div>
          <Button style={{width: 140}}>创建一个Bot</Button>
        </div>
      </div>
    )
  }
}



export default module.exports = Bot