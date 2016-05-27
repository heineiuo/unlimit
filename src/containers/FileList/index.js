import React, {Component} from 'react'
import {Link} from 'react-router'


class FileList extends Component {

  render(){

    const isFile = true
    const parentPath = ''

    if (isFile) {
      return (
        <div>
          <div>这是一个文件</div>
          <div className="btn-group">
            <div className="btn btn-sm btn-danger" data-onclick="delete" data-path={parentPath}>删除</div>
            <div className="btn btn-sm btn-primary" data-onclick="rename" data-path={parentPath}>重命名</div>
            <div className="btn btn-sm btn-primary" data-onclick="download" data-path={parentPath}>下载</div>
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
            {

              [].forEach((file, index) => {
                return (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>
                      <Link to={`/file?path=${parentPath}${item}`}>{item}</Link>
                    </td>
                    <td>
                      <div className="btn-group">
                        <span className="btn btn-sm btn-danger" data-onclick="delete" data-path={`${parentPath}${item}`}>删除</span>
                        <span className="btn btn-sm btn-primary" data-onclick="rename" data-path={`${parentPath}${item}`}>重命名</span>
                        <span className="btn btn-sm btn-primary" data-onclick="download" data-path={`${parentPath}${item}`}>下载</span>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
            </tbody>

          </table>
        )
      }
  }
}

export default FileList