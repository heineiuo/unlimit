import React, {Component} from 'react'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class Cli extends Component {


  render (){

    return (
      <div className="container width-max">

        <div className="paper">

          <div className="paper-header">
            <h3>CLI</h3>
          </div>

        </div>

      </div>
    )
  }
}

export default Cli