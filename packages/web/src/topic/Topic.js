import React, {Component} from 'react'
import {Link, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {css, StyleSheet} from 'aphrodite'
import Button from '@react-web/button'
import TopicList from './TopicList'
import TopicDetail from './TopicDetail'
import {emptyTopicState} from '../../actions/topic/topic'

class Topic extends Component {

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
      <div style={{padding: 20}}>
        <div style={{marginBottom: 20, display: 'flex', alignItems: 'center'}}>
          <div style={{marginRight: 20}}>文章</div>
          <Link to={`${match.url}/new`}>
            <Button style={{width: 80, backgroundColor: '#fff', borderColor: '#CCC', color: '#666'}} size='small'>添加</Button>
          </Link>
        </div>
        <Switch>
          <Route path={`${match.path}`} exact component={TopicList}/>
          <Route path={`${match.path}/new`} exact component={TopicDetail}/>
          <Route path={`${match.path}/:topicId`} component={TopicDetail}/>
        </Switch>
      </div>
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
)(Topic)
