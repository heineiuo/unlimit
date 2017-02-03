import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {StyleSheet, css} from 'aphrodite'
import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../constants'

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
  dispatch => bindActionCreators({



  }, dispatch)
)(FileList)