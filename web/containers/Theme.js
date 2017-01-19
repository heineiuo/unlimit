import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'


class Theme extends Component {

  componentWillMount = () => {
    const style = document.createElement('style')
    style.innerHTML =
      `
        * {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
    
        body {
          margin: 0;
          background-color: #f5f5f5;
        }
    
        a {
          color: #333;
          text-decoration: none;
        }
    
    `
    document.head.appendChild(style)
  }

  render (){
    return this.props.children
  }
}


export default connect((state) => {
  return {
    nav: state.nav
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({
      setNav: (next) => (dispatch) => dispatch({type: 'NAV_CHANGE', next})
    }, dispatch)
  }
})(Theme)