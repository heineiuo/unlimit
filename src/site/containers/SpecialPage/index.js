import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class SpecialPage extends Component {

  static defaultProps = {
    post_list: []
  };

  renderAllContent = () => {
    const {post_list} = this.props;
    return post_list.map(post=> {
      return (
        <div key={post.post_id} dangerouslySetInnerHTML={{__html: post.post_content}} />
      )
    })

  };

  render (){

    const {staticPath, homePath, post_list, pageTitle, pageName} = this.props;

    return (
      <div>
        <div className="block block-list">
          <div className="title">
            <div className="index-nav">
              <Link to="/">首页</Link>
              &gt;
              <Link to={`/${pageName}`}>{pageTitle}</Link>
            </div>
          </div>
          <div>
            {this.renderAllContent()}
          </div>
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
)(SpecialPage)
