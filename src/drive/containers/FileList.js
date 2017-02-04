import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {StyleSheet, css} from 'aphrodite'

class FileList extends Component {

  static defaultProps = {
    ls: [],
    parentPath: ''
  };

  render(){

    const {ls, hrefPrefix, path} = this.props;
    const parentPath = path == '/'?'':path;

    return (
      <div>
        {
          !ls.length?
            <div>目录为空</div>:
            <div>
              <div>
                <span>序号</span>
                <span>名称</span>
                <span>操作</span>
              </div>
              <div>
                {
                  ls.map((item, index) => (
                    <div key={item}>
                      <span>{index+1}</span>
                      <span>
                        <Link to={`${hrefPrefix}?path=${parentPath}/${item}`}>{item}</Link>
                      </span>
                      <span>
                        <span>删除</span>
                        <span>重命名</span>
                        <span>下载</span>
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
        }
      </div>
    )

  }
}

export default connect(
  state => ({
    account: state.account
  }),
  dispatch => bindActionCreators({

  }, dispatch)
)(FileList)