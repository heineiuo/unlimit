import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Spin from 'react-spin'
import Button from 'react-sea/lib/Button'
import AceEditor from 'react-ace'
import {StyleSheet, css} from 'aphrodite/no-important'
import path from 'path'
import CreateFile from './CreateFile'

import 'brace/theme/monokai'
import 'brace/mode/javascript'
import 'brace/mode/css'
import 'brace/mode/json'
import 'brace/mode/html'
import 'brace/mode/plain_text'

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
      isCreated
    });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.fileContent.createState === 2){
      this.setState({
        isCreated: true,
        fileName: nextProps.fileName
      })
    }
  };

  componentWillUnmount = () => {
    // this.props.initFile()
  };

  onChange = (newValue) => {
    // console.log('[change]:', newValue);
    this.editorValue = newValue;
  };

  saveFile = () => {
    const {driveId, updateFile} = this.props;
    updateFile({
      driveId,
      content: this.editorValue
    })
  };

  getMode = (fileName) => {
    const extname = path.extname(fileName);
    return extname.length === 0?'plain_text':
      ext2mode[extname.substring(1)] || 'plain_text';
  };

  render(){
    const {fileContent, parentId, fileContent: {fileState}, driveId} = this.props;
    const {fileName, isCreated} = this.state;
    const value = new Buffer(fileContent.cat).toString();
    const mode = this.getMode(fileName);

    return (
      !isCreated?(
        <CreateFile
          parentId={parentId}
          driveId={driveId}
        />
      ): fileState < 2?
        <Spin />:(
        <div>
          {/* 按钮区域 */}
          <div className={css(styles.header)}>
            <div>smile text editor</div>
            <div className={css(styles.fileName)}>{fileName}</div>
            <div className={css(styles.buttonBar)}>
              <Button style={{width: 120}} onClick={this.saveFile}>
                {
                  fileState === 2? <div>保存</div>:
                    <div>正在保存</div>
                }
              </Button>
            </div>
          </div>

          <AceEditor
            width={`100%`}
            height={`${window.innerHeight}px`}
            defaultValue={value}
            mode={mode}
            theme="monokai"
            onChange={this.onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{$blockScrolling: true}}/>
        </div>
      )

    )
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
  }
});

export default module.exports = connect(
  (store) => ({
    account: store.account,
    fileName: store.file.fileName,
    fileContent: store.file,
  }),
  (dispatch) => bindActionCreators({
    getFileContent: require('../actions/file/getFileContent').default,
    updateFile: require('../actions/file/updateFile').default,
    initFile: require('../actions/file/initFile').default,
    updateFileMeta: require('../actions/file/updateFileMeta').default,
    createFile: require('../actions/file/createFile').default
  }, dispatch)
)(Ace);
