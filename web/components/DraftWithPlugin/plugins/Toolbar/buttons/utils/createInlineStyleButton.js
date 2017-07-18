import React, { Component } from 'react';
import { RichUtils } from 'draft-js';
import styles from './styles'
import {css} from 'aphrodite'

export default ({ style, children }) => (
  class InlineStyleButton extends Component {

    toggleStyle = (event) => {
      event.preventDefault();
      this.props.setEditorState(
        RichUtils.toggleInlineStyle(
          this.props.getEditorState(),
          style
        )
      );
    }

    preventBubblingUp = (event) => { event.preventDefault(); }

    styleIsActive = () => this.props.getEditorState().getCurrentInlineStyle().has(style);

    render() {
      const isActive = this.styleIsActive();
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
