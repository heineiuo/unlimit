import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class Theme extends Component {


  render () {

    return (
      <div>
        敬请期待
      </div>

    )
  }
}

const styles = StyleSheet.create({


});

export default module.exports = connect(
  (state) => ({
    routing: state.routing,
    searchuser: state.searchuser,
    account: state.account
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Theme)