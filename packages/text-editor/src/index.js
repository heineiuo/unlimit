import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Spin from 'react-spin'
import Button from '@react-web/button'
// import AceEditor from 'react-ace'
import {StyleSheet, css} from 'aphrodite/no-important'
import path from 'path'
import CreateFile from './CreateFile'
import Textarea from 'react-textarea-autosize'
import { getFileContent, updateFile, initFile, updateFileMeta, createFile } from './actions'

// import 'brace/theme/monokai'
// import 'brace/mode/javascript'
// import 'brace/mode/css'
// import 'brace/mode/json'
// import 'brace/mode/html'
// import 'brace/mode/plain_text'

const ext2mode = {
  js: 'javascript',
  html: 'html',
  css: 'css',
  json: 'json'
};

class Ace extends Component {


  state = {
    mode: 'plain_text',
    isCreated: true,
    fileName: '',
    ext: ''
  };

  editorValue = ''

  componentDidMount = () => {
    const {driveId, fileId, fileName, parentId, isCreated} = this.props;
    console.log({driveId, fileId, fileName, parentId, isCreated})
    if (isCreated) {
      this.props.updateFileMeta({fileId})
      this.props.getFileContent(driveId);
    }
    this.setState({
      parentId,
      fileId,
      createState: 2,
    });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.fileContent.fileContentState > this.props.fileContent.fileContentState){
      
      this.setState({
        fileName: nextProps.fileName,
        editorValue: nextProps.fileContent.cat
      })
    }
    
  };
  

  componentWillUnmount = () => {
    console.log('text editor: unmount')
    // this.props.initFile()
  };

  onChange = (e) => {
    this.setState({editorValue: e.target.value})
  };

  saveFile = () => {
    const {driveId, updateFile} = this.props;
    const {editorValue} = this.state;
    updateFile({
      driveId,
      content: editorValue
    })
  };

  getMode = (fileName) => {
    console.log(fileName)
    const extname = path.extname(fileName);
    return extname.length === 0?'plain_text':
      ext2mode[extname.substring(1)] || 'plain_text';
  };

  render () {
    const {
      fileContent, parentId, driveId,
      fileContent: {
        fileState, 
        fileName, 
        fileContentState
      }
    } = this.props;
    const mode = this.getMode(fileName);

    return fileContent.createState === 0 ? 
      <CreateFile
        parentId={parentId}
        driveId={driveId}
      /> : 
      fileContent.createState === 1 ?
        <Spin />:
        fileContentState < 2?
          <Spin /> :
          <div>
            {/* 按钮区域 */}
            <div className={css(styles.header)}>
              <div>smile text editor</div>
              <div className={css(styles.fileName)}>{fileName}</div>
              <div className={css(styles.buttonBar)}>
                <Button style={{width: 120}} onClick={this.saveFile}>
                  <div>保存</div>
                </Button>
              </div>
            </div>
            <Textarea 
              className={css(styles.editor)}
              useCacheForDOMMeasurements
              onChange={this.onChange}
              value={this.state.editorValue}
            />
          </div>
  }

}

const styles = StyleSheet.create({
  header: {
    height: 30,
    backgroundColor: '#666',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    color: '#EEE'
  },
  buttonBar: {
    borderBox: 'box-sizing',
  },

  editor: {
    backgroundColor:'#282828',
    color: '#F1F1F1',
    flex: 1,
    width: '100%',
    minHeight: 500,
    fontSize: 14,
    lineHeight: '20px',
    boxSizing: 'border-box',
    fontFamily: 'monospace'
  }
});

export default module.exports = connect(
  (store) => ({
    account: store.account,
    fileName: store.file.fileName,
    fileContent: store.file,
  }),
  (dispatch) => bindActionCreators({
    getFileContent, updateFile, initFile, updateFileMeta, createFile
  }, dispatch)
)(Ace);
