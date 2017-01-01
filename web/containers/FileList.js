import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {StyleSheet, css} from 'aphrodite';
import * as API from 'youkuohao-sdk/gateway'

class FileList extends Component {


  static defaultProps = {
    ls: [],
    parentPath: ''
  }


  renderList = () => {
    const {ls, parentPath, hrefPrefix} = this.props
    return ls.map((file, index) => {
      return (
        <tr key={index}>
          <td>{index+1}</td>
          <td>
            <Link to={`${hrefPrefix}?path=${parentPath}/${file}`}>{file}</Link>
          </td>
        </tr>
      )
    })
  }

  render(){

    const isFile = false
    const parentPath = ''
    const {ls} = this.props

    if (isFile) {
      return (
        <div>
          <div>这是一个文件</div>

        </div>
      )

    } else if (!ls.length) {

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

export default connect(
  state => ({
    account: state.account
  }),
  dispatch => ({
    actions: bindActionCreators({
      deleteFile: (filename) =>  async (dispatch, getState) => {
        try {
          const result = await API.FileRm(filename)
          if (result.error) throw result.error

        } catch(e){
          console.log(e)
          console.log()
        }
      },
      downloadFile : (path)=> async (dispatch) => {
        try {

          var url = API.FileDownload(path)
          window.open(url)

        } catch(e){
          console.log(e)
          console.log()
        }
      },

      getDirInfo: (path) => async (dispatch) => {
        try {
          path = decodeURI(path)
          const result = await API.FileLs(path);
          result.parentPath = path + ( path =='/'?'':'/')

        } catch(e){
          console.log(e)
          console.log()
        }
      },

      /**
       * 重命名文件
       * @returns {function()}
       */
      renameFile: (prevName, nextName)=> async (dispatch, getState) => {
        try {

          const result = await API.FileMv(prevName, nextName)
          if (result.error) throw result.error

        } catch(e){
          console.log(e)
        }
      },

      uploadFileToPath: () =>async (dispatch) => {
        try {

          // url: api['uploadImage'][2]+'?'+encodeQuery(formData),

        } catch(e){
          console.log(e)
          console.log()
        }
      }



    }, dispatch)
  })
)(FileList)