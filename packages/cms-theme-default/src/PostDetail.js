import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Loading from 'react-spin'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {StyleSheet, css} from 'aphrodite'

import commonStyle from './styles'

class PostDetail extends Component {

  static defaultProps = {
    queryPostDetail: () => {},
    postItem: {
      pending: true,
    },
    staticPath: '',
    categoryName: '',
    categoryTitle: '',
    content: ''
  };

  componentWillMount = () => {
    const {match: {params}} = this.props;
    this.props.queryPostDetail(params.postId);
  };

  render (){
    const {posts} = this.props;
    return (
      <div>
        <div>
          {
            posts.pending?
              <Loading />:
              posts.isFound?
                <div>
                  <div>{posts.detail.title}</div>
                  <div dangerouslySetInnerHTML={{__html: posts.detail.html}} />
                </div>:
                <div>not found</div>
          }
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  ...commonStyle,

});


export default module.exports =  connect(
  (store) => ({
    account: store.account,
    posts: store.posts,
  })
)(PostDetail)
