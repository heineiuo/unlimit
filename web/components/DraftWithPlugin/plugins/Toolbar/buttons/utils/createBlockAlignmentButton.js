import React, { Component } from 'react';
import styles from './styles'
import {css} from 'aphrodite'

export default ({ alignment, children }) => (
  class BlockAlignmentButton extends Component {

    activate = (event) => {
      event.preventDefault();
      this.props.setAlignment({ alignment });
    }

    preventBubblingUp = (event) => { event.preventDefault(); }

    isActive = () => this.props.alignment === alignment;

    render() {
      const isActive = this.isActive();
      return (
        <div
          className={css(styles.buttonWrapper)}
          onMouseDown={this.preventBubblingUp}
        >
          <button
            className={css(styles.button, isActive && styles.button_active)}
            onClick={this.activate}
            type="button"
            children={children}
          />
        </div>
      );
    }
  }
);
