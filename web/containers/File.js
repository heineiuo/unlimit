import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FileList from './FileList'
import Paper from 'react-sea/lib/Paper'
import * as API from ';youkuohao-sdk/gateway'

class File extends Component {

  static defaultProps = {
    parentPath: '',
    file: ''
  };

  updateFileList = (props) => {
    const {host_id} = this.props.params;
    const {path} = props.location.query;
    const {getFileList} = this.props.actions;
    getFileList(host_id, path)
  };

  componentDidMount = () => {
    this.updateFileList(this.props)
  };

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps.location.query.path, this.props.location.query.path)
    if (nextProps.location.query.path != this.props.location.query.path) {
      this.updateFileList(nextProps)
    }
  }

  render (){

    const {parentPath, file} = this.props
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
          hrefPrefix={`/host/${this.props.params.host_id}/file`}/>
      </Paper>
    )

  }

}

export default module.exports = connect((state) => {
  return {
    host: state.host,
    file: state.file
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({
      getFileList: (hostname, path='/') => async (dispatch, getState) => {
        try {
          dispatch({
            type: 'FILE_LIST_UPDATE',
            ls: []
          });

          const result = await API.FileLs(hostname, path)
          if (result.error) throw result.error

          dispatch({
            type: 'FILE_LIST_UPDATE',
            ls: result.ls
          })

        } catch(e){
          console.log(e.stack||e)
        }
      }
    }, dispatch)
  }
})(File)