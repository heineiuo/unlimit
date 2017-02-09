import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, css } from 'aphrodite/no-important'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import Paper from 'react-sea/lib/Paper'
import Button from 'react-sea/lib/Button'
import Upload from 'rc-upload'
import {setTitle} from '../store/nav'
import {getFileList} from '../store/file'
import Spin from 'react-spin'

class File extends Component {

  componentWillMount = () => {
    const {setTitle, getFileList, host, location} = this.props;
    getFileList(location.query.path);
    setTitle(`${host.hostname} - 文件`);
  };

  componentWillReceiveProps = (nextProps) => {
    const {getFileList, location, setTitle} = this.props;
    const nextPath = nextProps.location.query.path;

    if (nextProps.file.fileState == 0) {
      setTitle(`${nextProps.host.hostname} - 文件`);
      return getFileList('/');
    }

    if (nextPath != location.query.path) {
      getFileList(nextPath)
    }
  };

  render (){

    const {file, location, host} = this.props;
    const path = location.query.path || '/';
    const isFile = false;
    const hrefPrefix = `/${host.hostname}`;

      return (
      <div style={{padding: '20px 0', margin: '0 auto', maxWidth: 1000}}>
        <Paper>
          {
            file.fileState < 2?
              <Spin />:
              <div>
                <div>路径:{path}</div>
                {
                  isFile?
                    <div>这是个文件</div>:
                    <div>
                      <div className={css(styles.toolbar)}>
                        {/*展示样式*/}
                        <div>
                          <span>列表</span>
                          <span>图标</span>
                        </div>
                        {/*剪贴板*/}
                        <div>
                          <span>剪贴板</span>
                        </div>
                        {/*上传*/}
                        <div>
                          <Upload>
                            <div style={{width: 80}}>
                              <Button type="primary" size="small">上传文件</Button>
                            </div>
                          </Upload>
                        </div>
                        {/*选中操作*/}
                      </div>
                      <div className={styles.fileList}>
                        {
                          !file.ls.length?
                            <div>目录为空</div>:
                            <div>
                              <div>
                                <span>序号</span>
                                <span>名称</span>
                                <span>操作</span>
                              </div>
                              <div>
                                {
                                  file.ls.map((item, index) => (
                                    <div key={item.name}>
                                      <span>{index+1}</span>
                                      <span>
                                        <Link to={`${hrefPrefix}?path=${path=="/"?'':path}/${item.name}`}>{item.name}</Link>
                                      </span>
                                      <span>
                                        <span>删除</span>
                                        <span>重命名</span>
                                        {item.isFile? <span>下载</span> : null}
                                        {item.isDirectory? <span>进入</span> : null}
                                      </span>
                                    </div>
                                  ))
                                }

                              </div>
                            </div>
                        }
                        <div>
                          <Link to={`${hrefPrefix}/location`}>Location</Link>
                        </div>
                      </div>
                    </div>
                }
              </div>
          }

        </Paper>
      </div>

    )

  }

}

const styles = StyleSheet.create({
  toolbar: {
    display: 'flex',

  }
});

export default module.exports = connect(
  (state) => ({
    host: state.host,
    file: state.file
  }),
  (dispatch) => bindActionCreators({
    push,
    setTitle,
    getFileList,
  }, dispatch)
)(File)