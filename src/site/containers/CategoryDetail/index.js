import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {StyleSheet, css} from 'aphrodite/no-important'

class CategoryDetail extends Component {

  static defaultProps = {
    staticPath: '/home',
    homePath: ''
  };

  render(){
    const {staticPath, homePath, postList, category_name} = this.props;

    return (
      <div>
        <div className={css(styles.block)}>
          <div className={css(styles.block__title)}>
            <div>
              <Link className={css(styles.block__title__link)} to="/">首页</Link>
              &gt;
              <Link className={css(styles.block__title__link)}>{this.props.categoryTitle}</Link>
            </div>
          </div>

          <div className={`${css(styles.category__list_product)} clearfix`}>
            {
              postList.list.length == 0?
                <div>列表为空:(</div>:
                postList.list.map((item, index)=> {
                  return (
                    <div className="col-xs-6 col-sm-4" key={index}>
                      <Link to={`/post/${item.post_id}`}>{item.post_title}</Link>
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


  // .block .content {
  //   padding: 10px;
  //   color: #669f36
  // }
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
    // .category-list-product .img-responsive {
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

export default connect(
  (store) => ({
    postList: store.postList
  }),
  (dispatch) => bindActionCreators({

  }, dispatch)
)(CategoryDetail)