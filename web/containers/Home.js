import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Paper from 'react-sea/lib/Paper'
import {StyleSheet, css} from 'aphrodite'


class Home extends Component {

  componentWillMount = () => {
    this.props.actions.setNav('id0')
  };

  render (){
    return (
      <div style={{paddingTop: 20}}>

        <Paper style={{marginBottom: 20}}>
          <Link to={'/host'}>域名管理</Link>
        </Paper>

        <Paper style={{marginBottom: 20}}>
          <Link to={'/pm2'}>监控</Link>
        </Paper>

        <Paper style={{marginBottom: 20}}>
          <Link to={'/deploy'}>发布和持续集成</Link>
        </Paper>

        <Paper style={{marginBottom: 20}}>
          <Link to={'/cli'}>命令行模式</Link>
        </Paper>

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
      setNav: (next) => {return {type: 'NAV_CHANGE', next}}
    }, dispatch)
  }
})(Home)