import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class Home extends Component {

  static defaultProps = {
    staticPath: ""
  };

  render (){
    const {staticPath} = this.props;
    return (
      <div>
        <div style={{ minHeight: '100%', paddingBottom: 52}}>

        </div>
      </div>
    )
  }
}

export default connect(
  (store) => ({
    post_list: store.post_list
  }),
  (dispatch) => bindActionCreators({

  }, dispatch)
)(Home)
