import React, {Component} from 'react'
import { StyleSheet, css } from 'aphrodite/no-important'


class LineContent extends Component {

  static defaultProps = {
    deleteLineToPrev: () => {},
    destroyLine: () => {},
    breakLine: () => {},
    onUpdate: () => {},
    updateCursor: () => {}
  };

  state = {
    content: "",
  };

  handleKeyPress = (e) => {
    // console.log(window.getSelection());
    // console.log(window.getSelection().focusOffset);
    const {focusOffset} = window.getSelection();
    // console.log(this.state.content[focusOffset])
    if (e.keyCode == 'enter') {
      this.props.breakLine()
    }
  };

  handleMouseUp = (e) => {
    const {line, updateCursor} = this.props;
    // console.log(window.getSelection());
    // console.log(window.getSelection().focusOffset);
    const {focusOffset} = window.getSelection();
    this.props.updateCursor(line);
    // console.log(this.state.content[focusOffset])
  };

  componentWillMount = () => {

    const {text} = this.props;
    const replaceWhiteSpace = text.replace(/ /g, '\u00a0')
      .replace(/\t/g, '\u00a0\u00a0');

    this.setState({
      content: replaceWhiteSpace
    })

  };

  componentDidMount = () => {
    if (this.props.currentCursor == this.props.line ) {
      this.line.focus()
    }
  };

  render () {
    const {content} = this.state;
    const {line} = this.props;

    return (
      <div
        ref={line => this.line = line}
        onMouseUp={this.handleMouseUp}
        //onKeyPress={this.handleKeyPress}
        className={css(styles.lineContent)}>
        {content}
      </div>
    )
  }
}

const styles = StyleSheet.create({

  lineContent: {
    outline: 'none',
    height: 20,
    whiteSpace: "nowrap",
    lineHeight: '20px'
  }
});

export default LineContent
