import React, {Component} from 'react'
import {Link, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {css, StyleSheet} from 'aphrodite'
import Button from '@react-web/button'
import DropDown, {DropDownTrigger, DropDownContent} from '@react-web/dropdown'
import TagsEditor from './TagsEditor'
import makeCancelable from '../../makeCancelable'
import hoverHoc from '../../components/hoverHoc'
import {allStatus} from '../../actions/topic/editTopicStatus'
import TopicCommentList from './TopicCommentList'
import DraftWithPlugin from '../../components/DraftWithPlugin'

const StatusItem = hoverHoc(props => (
  <div
    onClick={() => props.onSelect(props.status)}
    className={css(styles.statusItem, props.hovered && styles.statusItem_hover)}
  >
    {allStatus[props.status]}
  </div>
))

class TopicDetail extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    isEditing: false,
    isCreated: true,
  };

  componentWillMount = () => {
    const {match: {params: {driveId, topicId}}} = this.props;
    if (!topicId) {
      this.setState({
        isCreated: false,
        title: '',
        tags: '',
        status: 0
      })
    } else if (topicId === this.props.current.topicId) {
      this.setState(this.props.current)
    } else {
      this.setState({
        title: '正在获取',
        html: '正在获取',
        tags: ''
      })
      this.props.getTopic(driveId, topicId)
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.state.isCreated && nextProps.currentState === 2) {
      this.setState(nextProps.current)
      this.tagsEditor.setTags(nextProps.current.tags.split(','))
    }
  };

  componentWillUnmount = () => {
    try {
      this.editTagPromise.cancel()
      this.editStatusPromise.cancel()
    } catch(e){
      // console.log(e)
    }
  };

  onTagsChange = async (tags) => {
    const {match: {params: {topicId}}} = this.props;
    this.editTagPromise = makeCancelable(this.props.editTopicTags({tags: tags.join(','), topicId}))
    try {
      await this.editTagPromise
    } catch(e){
      // console.log(e)
    }
  }

  saveArticle = () => {
    const {title, isCreated, tags} = this.state;
    const {match: {params: {driveId, topicId}}} = this.props
    const editorState = this.contentEditor.getEditorState();
    if (!isCreated){
      this.props.postTopic({title, editorState, driveId})
      this.setState({
        isCreated: true,
        isEditing: false
      })
    }
    this.props.putTopic({title, editorState, topicId, tags})
  }

  openEditMode = () => this.setState({isEditing: true})
  exitEditMode = () => this.setState({isEditing: false})

  changeTopicStatus = async (status) => {
    const {match: {params: {topicId}}} = this.props;
    const {isCreated} = this.state;
    this.setState({status})
    this.editStatusPromise = makeCancelable(this.props.editTopicStatus({status, topicId}))
    try {
      await this.editStatusPromise
    } catch(e){
      console.log(e)
    }
    this.statusDropDown.hide()
  }

  render(){
    const {isCreated, isEditing, title, tags, html, status, content} = this.state;
    return (
      <div>
        <div>
          <div className={css(styles.topicContent)}>
            <div className={css(styles.content)}>
              <div className={css(styles.content__titleBar)}>
                <div style={{flex: 1}}>
                  {
                    !isCreated || isEditing ?
                      <div>
                        <input
                          placeholder="输入标题"
                          type="text"
                          onChange={(e) => this.setState({title: e.target.value})}
                          value={this.state.title}
                          className={css(styles.titleInput)}/>
                      </div> :
                      <div>{title}</div>
                  }
                </div>
                <div>
                  {
                    isEditing || !isCreated ?
                      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {/*不保存，退出编辑模式*/}
                        {
                          !isCreated ? null :
                            <Button style={{flex: 1}} type="primary" size="large" onClick={this.exitEditMode}>退出编辑</Button>
                        }
                        {/*保存, 不退出编辑模式*/}
                        <Button style={{flex: 1}} type="primary" size="large" onClick={this.saveArticle}>保存</Button>
                      </div> :
                      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {/*进入编辑模式*/}
                        <Button style={{width: 100}} type="primary" size="large" onClick={this.openEditMode}>编辑</Button>
                      </div>
                  }
                </div>
              </div>

              {
                !isCreated || isEditing ?
                  <div className={css(styles.editorContainer)}>
                    {/*<Draft />*/}
                    {/*<RichText />*/}
                    <DraftWithPlugin rawContent={content} ref={ref => this.contentEditor = ref}/>
                  </div> :
                  <div dangerouslySetInnerHTML={{__html: html}} />
              }
            </div>
            {/* sidebar start */}
            <div className={css(styles.center__side)}>
              <div>标签:</div>
              <div>
                <TagsEditor
                  ref={ref => this.tagsEditor = ref}
                  tags={tags.split(',')}
                  onTagsChange={this.onTagsChange} />
              </div>

              {/*修改状态*/}
              <DropDown ref={ref => this.statusDropDown = ref}>
                <DropDownTrigger>{allStatus[status]}</DropDownTrigger>
                <DropDownContent>
                  {
                    allStatus.map((item, index) => (
                      <StatusItem key={item} status={index} onSelect={this.changeTopicStatus}/>
                    ))
                  }
                </DropDownContent>
              </DropDown>

            </div>
            {/*sidebar end*/}
          </div>
        </div>
        <div className={css(styles.commentListWrapper)}>
          {
            !isCreated ? null :
              <TopicCommentList />
          }
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  topicContent: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  content: {
    flex: 1
  },

  content__titleBar: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  statusItem: {
    backgroundColor: '#FFF'
  },
  statusItem_hover: {
    backgroundColor: '#AADDFf'
  },
  commentListWrapper: {

  },

  center: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    maxWidth: 1100,
    margin: '0 auto',
  },

  center__main: {
    flex: 1,
  },

  center__side: {
    padding: '0 20px',
    width: 300,
  },

  uploadBanner: {
    height: 200,
    textAlign: 'center',
    lineHeight: '200px',
    fontSize: 20,
    color: '#dddddd',
    backgroundColor: '#EEE',
    // border: '3px dashed #eee',
    transition: 'all .15s ease',
    ":hover": {
      backgroundColor: '#E8E8E8'
    }
  },

  uploadBanner__img: {
    width: '100%',
    height: '100%'
  },

  titleInput: {
    width: '100%',
    // border: '1px solid #DDD',
    // borderWidth: '0 0 1px 0',
    borderWidth: 0,
    backgroundColor: '#F8F8F8',
    // lineHeight: '30px',
    lineHeight: '46px',
    fontSize: 20,
    textAlign: 'center',
  },

  editorContainer: {
    minHeight: 400,
    boxSizing: 'border-box',
    padding: '20px 0',
  }
})

export default connect(
  (store) => ({
    currentState: store.topic.currentState,
    current: store.topic.current
  }),
  (dispatch) => bindActionCreators({
    postTopic: require('../../actions/topic/postTopic').default,
    putTopic: require('../../actions/topic/putTopic').default,
    editTopicTags: require('../../actions/topic/editTopicTags').default,
    editTopicStatus: require('../../actions/topic/editTopicStatus').default,
    getTopic: require('../../actions/topic/getTopic').default
  }, dispatch)
)(TopicDetail)
