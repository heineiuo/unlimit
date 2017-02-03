import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FileList from './FileList'
import Paper from 'react-sea/lib/Paper'
import {setTitle} from '../store/nav'
import {getFileList} from '../store/file'

class File extends Component {

  static defaultProps = {
    parentPath: '',
    file: ''
  };

  updateFileList = (props) => {
    const {hostname} = this.props.params;
    const {path} = props.location.query;
    this.props.getFileList(hostname, path);
  };

  componentWillMount = () => {
    this.props.setTitle('文件')
  };

  componentDidMount = () => {
    this.updateFileList(this.props)
  };

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps.location.query.path, this.props.location.query.path)
    if (nextProps.location.query.path != this.props.location.query.path) {
      this.updateFileList(nextProps)
    }
  };

  render (){

    const {parentPath, file, params} = this.props;

    return (
      <Paper>
        <div>
          <div>路径:</div>
          <ul>
          </ul>
          <div>
            <button>
              <span>上传文件</span>
              <input type="file" name="file" />
            </button>
            <div>
              <span>删除</span>
              <span>重命名</span>
              <span>下载</span>
            </div>
          </div>
        </div>
        <FileList
          parentPath={this.props.location.query.path}
          ls={this.props.file.ls}
          hrefPrefix={`/${params.hostname}/file`}/>
      </Paper>
    )

  }

}

export default module.exports = connect(
  (state) => ({
    host: state.host,
    file: state.file
  }),
  (dispatch) => bindActionCreators({
    setTitle,
    getFileList,
  }, dispatch)
)(File)