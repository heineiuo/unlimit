import React, {Component} from 'react'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import {css, StyleSheet} from 'aphrodite'
import hoverHoc from './common/hoverHoc'

const TagItem = hoverHoc(props => (
  <div className={css(styles.tag, props.hovered && styles.tag_hover)}>
    {props.value}
    <div
      className={css(styles.tag__close, props.hovered && styles.tag__close_show)}
      onClick={() => props.removeTag(props.value)}>x</div>
  </div>
))

class TagsEditor extends Component {
  static defaultProps = {
    readonly: true,
    onTagsChange: () => {}
  }

  state = {
    tags: [],
    isEditing: false,
    editing: '',
    errorMessage: ''
  }

  componentWillMount = () => {
    const {tags} = this.props;
    this.setState({tags})
  }

  createTag = (tag) => {
    const tags = this.state.tags.concat([tag])
    this.setState({
      tags,
      errorMessage: '',
      editing: ''
    })
    this.props.onTagsChange(tags)
  }

  setTags = (tags) => this.setState({tags})

  onInputKeyPress = (e) => {
    if (['Enter'].includes(e.key)) {
      let tag = e.target.value.trim();
      if (tag.split('').includes(',')) return this.setState({errorMessage: '请不要在标签中包含这些特殊符号「,」'})
      if (tag.length === 0) {
        if (e.target.value.length > 20) return this.setState({errorMessage: '求你了，别输空格了'})
        if (e.target.value.length > 10) return this.setState({errorMessage: '你输入再多空格都不行'})
        return this.setState({errorMessage: '标签不能为空'})
      }
      if (this.state.tags.includes(tag)) return this.setState({errorMessage: '这个标签已经添加过了'})
      this.createTag(tag)
    }
  }

  onInputChange = (e) => {
    this.setState({editing: e.target.value})
  }

  onAdd = (e) => {
    this.setState({
      isEditing: true,
      editing: ''
    })
    process.nextTick(() => this.input.focus());
  }

  updateTags = (tags) => this.setState({tags});

  removeTag = (tag) => {
    const {tags} = this.state;
    const nextTags = tags.filter(item => item !== tag)
    this.setState({
      tags: nextTags
    })
    this.props.onTagsChange(nextTags)
  }

  render(){
    const {tags, isEditing, editing, errorMessage} = this.state;
    return (
      <div>
        <div className={css(styles.tagBar)}>
          {
            tags.filter(item => item !== '').map(item => (
              <TagItem key={item} value={item} removeTag={this.removeTag}/>
            ))
          }
        </div>
        <span className={css(styles.addButton, isEditing && styles.addButton_hide)} onClick={this.onAdd}>添加</span>
        <span className={css(styles.inputBar, !isEditing && styles.inputBar_hide)} >
          <input
            ref={ref => this.input = ref}
            onKeyPress={this.onInputKeyPress}
            placeholder="输入"
            value={editing}
            onChange={this.onInputChange}/>
        </span>
        {
          errorMessage.length === 0 ? null:
            <span>{errorMessage}</span>
        }
      </div>
    )

  }
}


const styles = StyleSheet.create({
  tagBar: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#93c0ee',
    padding: '0 10px',
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 6,
    color: '#FFF',
    display: 'flex'
  },
  tag_hover: {
    backgroundColor: '#84a4ee',
  },
  tag__close: {
    display: 'none',
    backgroundColor: '#ff3c46'
  },
  tag__close_show: {
    display: 'block'
  },

  addButton_hide: {
    display: 'none'
  },
  addButton: {
  },

  inputBar: {
  },
  inputBar_hide: {
    display: 'none'
  }
});

export default TagsEditor;