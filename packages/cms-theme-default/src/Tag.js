import React, {Component} from 'react'
import {Link, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'

class CategoryDetail extends Component {

  static defaultProps = {
    postList: {
      list: []
    },
    staticPath: '/home',
    category_name: 'tag name',
    homePath: ''
  };

  componentWillMount = () => {
    const {match: {params: {tagName}}} = this.props;
    this.props.getPostList({filter: {tags: tagName}, fields: ['title']})
  };

  componentWillReceiveProps= (nextProps) => {
    const {match: {params: {tagName}}} = this.props;
    const nextTagName = nextProps.match.params.tagName;
    if (nextTagName !== tagName) {
      this.props.getPostList({filter: {tags: nextTagName}, fields: ['title']})
    }
  };

  render(){
    const {staticPath, homePath, posts, category_name, location, computedMatch} = this.props;
    return (
      <div>
        <div className={css(styles.block)}>
          <div className={css(styles.block__title)}>
            <div>
              <Link className={css(styles.block__title__link)} to="/">首页</Link>
              &gt;
              <span className={css(styles.block__title__link)}>{this.props.categoryTitle}</span>
            </div>
          </div>

          <div className={`${css(styles.category__list_product)} clearfix`}>
            {
              posts.list.length === 0?
                <div>列表为空:(</div>:
                posts.list.map((item, index)=> {
                  return (
                    <div className="col-xs-6 col-sm-4" key={index}>
                      {index}:
                      <Link to={`/post/${item.postId}`}>{item.title}</Link>
                    </div>
                  )
                })
            }
          </div>
          <div className="block-footer">
            <div className="pagenav">
              <ul className="pagination">
                <li>
                  <a href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li className="active"><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
                <li>
                  <a href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({

  ...commonStyle,

  block: {
    marginTop: 20,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },

  block__title: {
    padding: '0 10px',
    backgroundColor: '#b9dc91',
    lineHeight: '35px',
    color: '#669f36'
  },

  block__title__link: {
    color: '#669f36'
  },


  block__content: {
    padding: 10,
    color: '#669f36'
  },

  //
  // .block ul {
  //   padding: 20px 5px
  // }
  //
  // .block ul a {
  //   color: #669f36
  // }
  //
  // .block .readmore {
  //   color: #669f36
  // }
  //
  // .block-products ul {
  //   padding: 20px 0
  // }
  //
  // .block-products li a {
  //   display: block;
  //   line-height: 40px;
  //   background-color: #fff;
  //   margin-bottom: 5px;
  //   padding: 0 10px;
  //   font-size: 16px
  // }
  //
  // .block-news li a {
  //   display: block;
  //   line-height: 35px;
  //   border-bottom: 1px solid #b9dc91
  // }
  //
  //
  //
  //

//
  category__list_product: {
      paddingTop: 20
  }
    //
    // .category-list-product .card {
    //   border-radius: 6px;
    //   overflow: hidden;
    //   margin: 10px 0
    // }
    //
    // .category-list-product .images-responsive {
    //   width: 100%
    // }
    //
    // .category-list-product .caption {
    //   background-color: #b9dc91;
    //   line-height: 35px;
    //   text-align: center;
    //   color: #669f36
    // }
    //
    // .category-list-success ul li, .category-list-news ul li {
    //   border-bottom: 1px solid #fff;
    //   border-left: 3px solid #669f36;
    //   line-height: 25px;
    //   margin: 10px 20px;
    //   padding: 0 20px
    // }
});

export default module.exports = connect(
  (store) => ({
    account: store.account,
    posts: store.posts,
  }),
  (dispatch) => bindActionCreators({
    getPostList: require('../actions/getPostList').default
  }, dispatch)
)(CategoryDetail)
