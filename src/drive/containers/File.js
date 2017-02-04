import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FileList from './FileList'
import Paper from 'react-sea/lib/Paper'
import Button from 'react-sea/lib/Button'
import Upload from 'rc-upload'
import {setTitle} from '../store/nav'
import {getFileList} from '../store/file'

class File extends Component {

  static defaultProps = {
    parentPath: '',
    file: ''
  };

  updateFileList = (path) => {
    const {params, getFileList} = this.props;
    getFileList(params.hostname, path);
  };

  componentWillMount = () => {
    this.props.setTitle('文件')
  };

  componentDidMount = () => {
    const {location} = this.props;
    this.updateFileList(location.query.path||'/')
  };

  componentWillReceiveProps = (nextProps) => {
    const nextPath = nextProps.location.query.path;
    // console.log(nextPath, this.props.location.query.path);
    if (nextPath != this.props.location.query.path) {
      this.updateFileList(nextPath)
    }
  };

  render (){

    const {parentPath, file, params, location} = this.props;
    const path = location.query.path || '/';
    const isFile = false;

    return (
      <Paper>
        <div>
          <div>路径:{path}</div>
        </div>
        {
          isFile?
            <div>这是个文件</div>:
            <div>
              <div>
                <Upload>
                  <div style={{width: 80}}>
                    <Button type="primary" size="small">上传文件</Button>
                  </div>
                </Upload>
              </div>
              <FileList
                path={path}
                location={location}
                ls={file.ls}
                hrefPrefix={`/${params.hostname}/file`}/>
            </div>
        }

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