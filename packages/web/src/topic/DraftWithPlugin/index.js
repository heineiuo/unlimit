import React, { Component } from 'react'
import {StyleSheet, css} from 'aphrodite'
import {Editor, convertFromRaw, EditorState } from 'draft-js'

class DraftWithPlugin extends Component {

  state = {
  }

  componentWillMount = () => {
    if (this.props.rawContent) {
      this.setEditorStateFromRaw(this.props.rawContent)
    } else {
      this.setState({
        editorState: EditorState.createEmpty()
      })
    }
  }

  getEditorState = () => {
    return this.state.editorState
  }

  setEditorState = (editorState) => {
    this.setState({editorState})
  }

  setEditorStateFromRaw = (rawContent) => {
    const editorState = EditorState.createWithContent(
      convertFromRaw(rawContent)
    )
    this.setState({editorState})
  }

  focus = () => {
    this.editor.focus()
  }

  render(){
    const {editorState} = this.state
    return (
      <div>
        <div className={css(styles.editor)} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.setEditorState}
            ref={(ref) => this.editor = ref}
          />
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  editor: {
    border: '1px solid #EEE',
    padding: '20px',
    minHeight: 400
  }
})

export default DraftWithPlugin
