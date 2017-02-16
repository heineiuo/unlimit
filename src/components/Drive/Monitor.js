import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {setTitle} from '../store/nav'

class Monitor extends Component {

  componentWillMount = () => {
    this.props.setTitle('监控')
  };

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


export default module.exports = connect(
  (state) => ({
    nav: state.nav
  }),
  (dispatch) => bindActionCreators({
    setTitle
  }, dispatch)
)(Monitor)
