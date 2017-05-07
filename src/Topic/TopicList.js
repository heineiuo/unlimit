import React, {Component} from "react"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {css, StyleSheet} from "aphrodite"
import Input from "react-sea/lib/Input"
import Button from "react-sea/lib/Button"
import commonStyles from "./common/styles"
import hoverHoc from "./common/hoverHoc"
import {allStatus} from "../actions/editTopicStatus"

const TopicListItem = hoverHoc((props) => {
  const {url, title, _id, tags = '', status} = props;
  return (
    <div className={css(styles.item)}>
      <Link to={url} className={css(styles.link)}>
        <div>[{allStatus[status]}]{title || '无标题'}</div>
      </Link>
      <div>
        {
          tags.split(',').filter(item => item !== '').map(item => (
            <span className={css(styles.tag)} key={item}>{item}</span>
          ))
        }
      </div>
    </div>
  )
})

class TopicList extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    searchValue: ''
  };

  buildOptions = () => {

  }

  onSearchValueChange = (e) => {
    this.setState({searchValue: e.target.value})
  }

  onSearch = (e) => {
    const {match: {params: {driveId}}} = this.props;
    this.props.getTopicList(driveId, {
      keyword: this.state.searchValue
    })
  }

  componentWillMount = () => {
    const {match: {params: {driveId}}} = this.props;
    this.props.getTopicList(driveId)
    this.props.getDriveTopicTags(driveId)
  };

  render() {
    const {match, topicList, tagsUpdateState, tags, listUpdateState} = this.props;
    return (
      <div>
        <div className={css(styles.topicList__header)}>
          <div>
            <div style={{display: 'flex'}}>
              <Input
                value={this.state.searchValue}
                onChange={this.onSearchValueChange}
                style={{flex: 1, minWidth: 200}}
                placeholder='搜索'/>
              <Button onClick={this.onSearch}>搜索</Button>
            </div>
            <div>
              {
                [0, 1, 3].includes(tagsUpdateState) ?
                  [null, '正在加载', null, '加载出错'][tagsUpdateState] :
                  tags.length === 0 ?
                    null :
                    tags.map(item => (
                      <span className={css(styles.tag)} key={item.tag}>{item.tag}({item.value})</span>
                    ))
              }
            </div>
          </div>
          <Link to={`${match.url}/new`}>
            <Button>添加</Button>
          </Link>
        </div>
        <div className={css(styles.topicList__body)}>
          {
            [0, 1, 3].includes(tagsUpdateState) ?
              [null, '正在加载', null, '加载出错'][tagsUpdateState] :
              topicList.length === 0 ?
                <div>空</div> :
                topicList.map(item => (
                  <TopicListItem
                    url={`${match.url}/${item._id}`}
                    key={item._id}
                    {...item}/>
                ))
          }
        </div>

      </div>
    )
  }

}

const styles = StyleSheet.create({
  ...commonStyles,
  topicList__header: {
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between'
  },

  topicList__body: {},


  item: {
    borderBottom: '1px solid #e1e4e8',
    padding: '0 10px',
    height: 50,
    display: 'flex',
    justifyContent: 'space-between',
    lineHeight: '50px',
    ':hover': {
      backgroundColor: '#F8F8F8'
    }
  }
})


export default connect(
  (store) => ({
    topicList: store.topic.list,
    tags: store.topic.tags,
    tagsUpdateState: store.topic.tagsUpdateState,
    listUpdateState: store.topic.listUpdateState,
  }),
  (dispatch) => bindActionCreators({
    getTopicList: require('../actions/getTopicList').default,
    getDriveTopicTags: require('../actions/getDriveTopicTags').default,

  }, dispatch)
)(TopicList)
