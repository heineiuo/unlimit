import React, {Component} from 'react'
import {Link} from 'react-router'


import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class FileList extends Component {

  renderList =()=>{
    return [].map((file, index) => {
      return (
        <tr key={index}>
          <td>{index+1}</td>
          <td>
            <Link to={`/file?path=${parentPath}${file}`}>{file}</Link>
          </td>
          <td>
            <div className="btn-group">
                        <span className="btn btn-sm btn-danger"
                              data-onclick="delete"
                              data-path={`${parentPath}${file}`}>删除</span>
                        <span className="btn btn-sm btn-primary"
                              data-onclick="rename"
                              data-path={`${parentPath}${file}`}>重命名</span>
                        <span className="btn btn-sm btn-primary"
                              data-onclick="download"
                              data-path={`${parentPath}${file}`}>下载</span>
            </div>
          </td>
        </tr>
      )
    })
  }

  render(){

    const isFile = true
    const parentPath = ''
    const files = []

    if (isFile) {
      return (
        <div>
          <div>这是一个文件</div>
          <div className="btn-group">
            <div
              className="btn btn-sm btn-danger"
              data-onclick="delete"
              data-path={parentPath}>删除</div>
            <div
              className="btn btn-sm btn-primary"
              data-onclick="rename"
              data-path={parentPath}>重命名</div>
            <div
              className="btn btn-sm btn-primary"
              data-onclick="download"
              data-path={parentPath}>下载</div>
          </div>
        </div>
      )

    } else if (!files.length) {

        return <div>目录为空</div>

      } else {


        return (

          <table className="table table-bordered table-hover">
            <thead>
            <tr>
              <th>序号</th>
              <th>名称</th>
              <th>操作</th>
            </tr>
            </thead>

            <tbody>
            { this.renderList()}
            </tbody>

          </table>
        )
      }
  }
}

export default FileList