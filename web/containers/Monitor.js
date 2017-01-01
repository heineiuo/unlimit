import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as API from 'youkuohao-sdk/gateway'

class Monitor extends Component {

  componentWillMount = () => {
    this.props.actions.setNav('id3')
  }

  render (){

    return (
      <div className="container width-max">

        <div className="paper">

          <div className="paper-header">
            <h3>Monitor</h3>
          </div>

        </div>

      </div>
    )
  }
}


export default module.exports = connect((state) => {
  return {
    nav: state.nav
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({
      setNav: (next) => dispatch({type:'NAV_CHANGE', next})
    }, dispatch)
  }
})(Monitor)
