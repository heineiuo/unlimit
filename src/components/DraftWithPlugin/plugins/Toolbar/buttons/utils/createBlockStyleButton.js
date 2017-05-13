import React, { Component } from 'react';
import { RichUtils } from 'draft-js';
import styles from './styles'
import {css} from 'aphrodite'

export default ({ blockType, children }) => (
  class BlockStyleButton extends Component {

    toggleStyle = (event) => {
      event.preventDefault();
      this.props.setEditorState(
        RichUtils.toggleBlockType(
          this.props.getEditorState(),
          blockType
        )
      );
    }

    preventBubblingUp = (event) => { event.preventDefault(); }

    blockTypeIsActive = () => {
      const editorState = this.props.getEditorState();
      const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();
      return type === blockType;
    }

    render() {
      const isActive = this.blockTypeIsActive();
      return (
        <div
          className={css(styles.buttonWrapper)}
          onMouseDown={this.preventBubblingUp}
        >
          <button
            className={css(styles.button, isActive && styles.button_active)}
            onClick={this.toggleStyle}
            type="button"
            children={children}
          />
        </div>
      );
    }
  }
);
