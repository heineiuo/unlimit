import React, {Component} from 'react'
import { StyleSheet, css } from 'aphrodite/no-important'
import LineContent from './LineContent'
import select from 'selection-range'

class TextEditor extends Component {

  static defaultProps = {
    text: ""
  };

  state = {
    group: [] // example: ['function(){', '}']
  };

  lines = {};

  getContent = () => {
    return this.state.group.join('\n')
  };

  componentWillMount () {
    const {text} = this.props;
    const group = text.split(/\r|\n|\r\n/);
    this.setState({
      group,
    });
    this._currentLine = 1;
  };

  handleKeyPress = (e) => {
    console.log(e.target);
    console.log(e.key);
    if (e.key == 'Enter') {
      const currentCaretStart = select(this.content).start;
      const group = this.state.group.slice();
      // console.log(group);
      console.log(select(this.lines[this._currentLine-1].line).start);

      this._currentLine += 1;
      // console.log(group[this._currentLine -1 ]);
      group.splice(this._currentLine - 1, 0, '\u00a0');
      // console.log(group[this._currentLine -1 ]);
      // console.log(group);
      this.setState({
        group
      });
      select(this.content, {start: currentCaretStart+1});

      e.preventDefault();
      e.stopPropagation();
    }
  };

  updateCursor = (currentLine) => {
    console.log('updateCursor: '+ currentLine);
    this._currentLine = currentLine
  };

  render (){
    const {group} = this.state;
    const lineMarks = Array.from({length: group.length}, (v, k) => k+1);

    return (
      <div className={css(styles.editor)}>
        <div className={css(styles.gutter)}>
          {
            lineMarks.map(lineNumber => (
              <div key={lineNumber} className={css(styles.gutter__number)}>{lineNumber}</div>
            ))
          }
        </div>
        <div
          ref={content => this.content = content}
          suppressContentEditableWarning
          contentEditable
          onKeyPress={this.handleKeyPress}
          spellCheck={false}
          className={css(styles.textWrapper)}>
          {
            group.map((item, index) => {
              return (
                <LineContent
                  ref={line => this.lines[index] = line}
                  key={index+item}
                  currentCursor={this._currentLine}
                  line={index+1}
                  updateCursor={this.updateCursor}
                  text={item} />
              )
            })
          }
        </div>
      </div>
    )
  }
}

const fontFamily = `${['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'monospace'].join(',')}`;

const styles = StyleSheet.create({
  editor: {
    display: 'flex',
    // justifyContent: 'space-between',
    flexDirection: 'row',
  },
  gutter: {
    backgroundColor: '#444',
    color: '#D8D8D8',
    padding: '6px',
    textAlign: 'right'
  },

  gutter__number: {
    height: 20,
    lineHeight: '20px',
    fontFamily
  },
  textWrapper: {
    flex: 1,
    backgroundColor: '#282828',
    color: '#EEE',
    outline: 'none',
    overflowX: 'auto',
    padding: '6px',
    fontFamily
  },

  input: {
    opacity: 0,
    width: 20,
    height: 16

  }

});


export default module.exports = TextEditor
