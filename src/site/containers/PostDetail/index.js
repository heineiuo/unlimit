import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Loading from 'react-loading'
import {queryPostDetail} from '../../store/postItem'

class PostDetail extends Component {

  static defaultProps = {
    staticPath: '',
    categoryName: '',
    categoryTitle: '',
    content: ''
  };

  componentWillMount = () => {
    const {params, queryPostDetail} = this.props;
    console.log(params);
    queryPostDetail(params.postId);
  };

  render (){
    const {postItem, categoryName, categoryTitle} = this.props;

    return (

      <div>
        <div>
          {
            postItem.pending?
              <Loading />:
              postItem.isFound?
                <div>
                  <div>{postItem.detail.title}</div>
                  <div dangerouslySetInnerHTML={{__html: postItem.detail.content}} />
                </div>:
                <div>not found</div>
          }
        </div>
      </div>
    )
  }
}

export default connect(
  (store) => ({
    postItem: store.postItem
  }),
  (dispatch) => bindActionCreators({
    queryPostDetail

  }, dispatch)
)(PostDetail)