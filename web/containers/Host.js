import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as API from 'youkuohao-sdk/gateway'

class Host extends Component {

  componentWillMount = () => {
    this.props.actions.setNav('id2')
  }

  render (){
    return (
      this.props.children
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
      setNav: (next) => (dispatch) => dispatch({type: 'NAV_CHANGE', next})
    }, dispatch)
  }
})(Host)