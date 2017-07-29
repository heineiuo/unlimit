import React, { Component } from 'react'
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor'
import createToolbarPlugin from './plugins/Toolbar'
import createImagePlugin from 'draft-js-image-plugin'
import {StyleSheet, css} from 'aphrodite'
import ImageAdd from './plugins/Image/ImageAdd'
import {convertFromRaw, EditorState } from 'draft-js'

const toolbarPlugin = createToolbarPlugin();
const imagePlugin = createImagePlugin()
const plugins = [
  toolbarPlugin,
  imagePlugin
]

const { Toolbar } = toolbarPlugin

class DraftWithPlugin extends Component {

  componentWillMount = () => {
    if (this.props.rawContent) {
      this.setEditorStateFromRaw(this.props.rawContent)
    }
  }

  state = {
    editorState: createEditorStateWithText(''),
  };

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
    this.editor.focus();
  };

  render(){
    const {editorState} = this.state;
    return (
      <div>
        <Toolbar />
        <ImageAdd
          editorState={editorState}
          onChange={this.setEditorState}
          modifier={imagePlugin.addImage}
        />
        <div className={css(styles.editor)} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.setEditorState}
            plugins={plugins}
            ref={(ref) => this.editor = ref}
          />
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({

})

export default DraftWithPlugin