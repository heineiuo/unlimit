import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'
import Loading from 'react-spin'

const pageNameToTopicId = {
  '联系我们': '58f1d0ef981fccd2fbd73a7e',
  '关于我们': '58efbbed9383ca9b492cf087',
  '合作流程': '58f1d097981fccd2fbd73a7d'
}

class SpecialPage extends Component {

  static defaultProps = {
    post_list: []
  };

  componentWillMount = () => {
    const {match: {params: {pageName}}, queryPostDetail} = this.props;
    queryPostDetail(pageNameToTopicId[pageName]);
  };

  componentWillReceiveProps = (nextProps) => {
    const {match: {params: {pageName}}, queryPostDetail} = nextProps;
    const currentPageName = this.props.match.params.pageName;
    if (currentPageName !== pageName) {
      queryPostDetail(pageNameToTopicId[pageName]);
    }
  }

  render (){

    const {staticPath, homePath, currentTopicDetail, currentTopicState, pageTitle, match: {params: {pageName}}} = this.props;

    return (
      <div>
        <div className="block block-list">
          <div className={css(styles.block__title)}>
            <div className="index-nav">
              <Link to="/">首页</Link>
              &gt;
              <Link to={`/${pageName}`}>{pageTitle}</Link>
              <span>{pageName}</span>
            </div>
          </div>
          {
            currentTopicState === 1?
              <Loading />:
              currentTopicState === 2?
                <div>
                  <div>{currentTopicDetail.title}</div>
                  <div dangerouslySetInnerHTML={{__html: currentTopicDetail.html}} />
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


export default module.exports = connect(
  (store) => ({
    account: store.account,
    currentTopicState: store.posts.currentTopicState,
    currentTopicId: store.posts.currentTopicId,
    currentTopicDetail: store.posts.currentTopicDetail,
  }),
  (dispatch) => bindActionCreators({
    queryPostDetail: require('../actions/queryPostDetail').default
  }, dispatch)
)(SpecialPage)