import React, {Component} from 'react'
import {Link, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {css, StyleSheet} from 'aphrodite'
import TopicList from './TopicList'
import TopicDetail from './TopicDetail'
import {emptyTopicState} from '../reducers/topic'

class PostEdit extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
  };

  componentWillMount = () => {
    this.props.emptyTopicState()
  };

  render(){
    const {match} = this.props;
    return (
      <Switch>
        <Route path={`${match.path}`} exact component={TopicList}/>
        <Route path={`${match.path}/new`} exact component={TopicDetail}/>
        <Route path={`${match.path}/:topicId`} component={TopicDetail}/>
      </Switch>
    )
  }
}


export default connect(
  (store) => ({
    account: store.account,
  }),
  (dispatch) => bindActionCreators({
    emptyTopicState,
  }, dispatch)
)(PostEdit)
