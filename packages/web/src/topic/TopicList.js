import React, {Component} from "react"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {css, StyleSheet} from "aphrodite"
import Input from "@react-web/input"
import Button from "@react-web/button"
import {withHover} from "@react-web/hover"
import commonStyles from "../components/commonStyles"
import { getTopicList, getDriveTopicTags } from './'

const TopicListItem = withHover((props) => {
  const {url, title, _id, tags = '', status} = props;

  return (
    <div className={css(styles.item)}>
      <Link to={url} className={css(styles.link)}>
        <div style={{display: 'flex', alignItems: 'center'}}> 
          <div style={{marginRight: 6}}>
            {
              [
                <div className={css(styles.status, styles.status__draft)} />,
                <div className={css(styles.status, styles.status__online)} />,
                <div className={css(styles.status, styles.status__offline)} />
              ][status]
            }
          </div>
          {title || '无标题'}
        </div>
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
            <div style={{display: 'flex', position: 'relative', width: 400, paddingLeft: 10}}>
              <Input
                value={this.state.searchValue}
                onChange={this.onSearchValueChange}
                style={{flex: 1, width: 400}}
                placeholder='搜索'/>
              <Button onClick={this.onSearch} style={{position: 'absolute', width: 100, height: 35, top: 1, right: 1, bottom: 1}}>搜索</Button>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', padding: 10}}>
              {
                [0, 1, 3].includes(tagsUpdateState) ?
                  [null, '正在加载', null, '加载出错'][tagsUpdateState] :
                  tags.length === 0 ?
                    null :
                    tags.map(item => (
                      <span className={css(styles.tag)} style={{marginBottom: 4}} key={item.tag}>{item.tag}({item.value})</span>
                    ))
              }
            </div>
          </div>
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

  tag: {
    backgroundColor: '#87b4e4',
    color: '#FFF',
    borderRadius: 4,
    fontSize: 14,
    marginRight: 4,
    padding: '0 6px'
  },

  item: {
    borderBottom: '1px solid #e1e4e8',
    padding: '0 10px',
    height: 50,
    display: 'flex',
    justifyContent: 'space-between',
    lineHeight: '50px',
    ':hover': {
      backgroundColor: '#F8F8F8'
    },

  },

  status: {
    display: 'inline-block',
    fontSize: '10px',
    border: '2px solid #46c314',
    height: '24px',
    padding: '0 2px',
    float: 'left',
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    borderRadius: '8px',
    color: '#46c314',
    textAlign: 'center',
  },
  status__draft: {borderColor: '#ffab06', color: '#ffab06', ':after': {content: '"草稿"'}},
  status__online: {borderColor: '#46c314', color: '#46c314', ':after': {content: '"发布"'}},
  status__offline: {borderColor: '#ccc', color: '#ccc', ':after': {content: '"下线"'}}
})


export default connect(
  (store) => ({
    topicList: store.topic.list,
    tags: store.topic.tags,
    tagsUpdateState: store.topic.tagsUpdateState,
    listUpdateState: store.topic.listUpdateState,
  }),
  (dispatch) => bindActionCreators({
    getTopicList,
    getDriveTopicTags,
  }, dispatch)
)(TopicList)
