import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {setTitle} from '../store/nav'
import {push} from 'react-router-redux'

class Host extends Component {

  componentWillMount = () => {
    // this.props.setTitle('域名设置');
    // this.props.push('/www.youkuohao.com/file')
  };

  render (){
    return (
      this.props.children
    )
  }

}


export default module.exports = connect(
  (state) => ({
    nav: state.nav
  }),
  (dispatch) => bindActionCreators({
    setTitle,
    push
  }, dispatch)
)(Host)