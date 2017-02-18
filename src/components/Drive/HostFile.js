import React, {Component} from 'react'
import { StyleSheet, css } from 'aphrodite/no-important'
import { Link } from 'react-router'
import Button from 'react-sea/lib/Button'
import Upload from 'rc-upload'
import {setTitle} from '../../store/nav'
import {getFileList} from '../../store/file'
import Spin from 'react-spin'
import TextEditor from '../TextEditor'

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

    const {file, file: {isFile, cat, ls}, location, host} = this.props;
    const path = location.query.path || '/';
    const hrefPrefix = `/drive/${host.hostname}`;
    const parsed = path.split('/').filter(item => item != '');

    return (

      <div>
        {
          file.fileState < 2?
            <Spin />:
            <div>
              <div className={css(styles.headerBar)}>
                <div className={css(styles.headerBar__path)}>
                  <Link to={`${hrefPrefix}?path=/`}>空间</Link>
                  {(() => {
                    let prevPath = '';
                    return parsed.map((dirname, index) => {
                      const currentLink = `${hrefPrefix}?path=${prevPath}/${dirname}`;
                      prevPath = `${prevPath}/${dirname}`;
                      return (
                        <span key={index}>
                          <span> > </span>
                          <span>
                            {
                              index == parsed.length - 1 ?
                                <span className={css(styles.headerBar__path__dirname)}>{dirname}</span>:
                                <Link className={css(
                                  styles.headerBar__path__dirname,
                                  styles.headerBar__path__dirname_link,
                                  )} to={currentLink}>{dirname}</Link>
                            }
                          </span>
                      </span>
                      )
                    })
                  })()}
                </div>
                <div className={css(styles.headerBar__tools)} style={isFile?{display: 'none'}:{}}>
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
              </div>
              {
                isFile?
                  <div className="file">
                    <div>
                      <TextEditor text={cat} ref={(editor) => this.editor = editor}/>
                    </div>
                  </div>:
                  <div className="directory">
                    <div className={styles.fileList}>
                      {
                        !ls.length?
                          <div>目录为空</div>:
                          <div>
                            <div className={css(styles.listViewBar)}>
                              <div className={css(styles.listViewBar__index)}>序号</div>
                              <div className={css(styles.listViewBar__name)}>名称</div>
                              <div className={css(styles.listViewBar__options)}>操作</div>
                            </div>
                            <div>
                              {
                                file.ls.map((item, index) => (
                                  <div key={item.name} className={css(styles.fileItem)}>
                                    <div className={css(styles.fileItem__index)}>{index+1}</div>
                                    <div className={css(styles.fileItem__name)}>
                                      <Link to={`${hrefPrefix}?path=${path=="/"?'':path}/${item.name}`}>{item.name}</Link>
                                    </div>
                                    <div className={css(styles.fileItem__options)}>
                                      <span onClick={() => this.props.deleteFile()}>删除</span>
                                      <span>重命名</span>
                                    </div>
                                  </div>
                                ))
                              }

                            </div>
                          </div>
                      }
                    </div>
                  </div>
              }
            </div>
        }
      </div>
    )
  }
}

const styles = StyleSheet.create({
  headerBar: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: '10px 10px',
    borderBottom: '1px solid #EEE'
  },
  headerBar__path: {
    padding: '4px 10px',
  },
  headerBar__path__dirname: {
    flex: 1,
    padding: '0 8px'
  },
  headerBar__path__dirname_link: {
    ":hover": {
      backgroundColor: '#EEE'
    }
  },
  headerBar__tools: {
    display: 'flex'
  },

  listViewBar: {
    display: 'flex',
    padding: '5px 10px',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listViewBar__index: {
    width: 40
  },
  listViewBar__name: {
    flex: 1
  },
  listViewBar__options: {
    flex: 1
  },

  fileItem: {
    borderBottom: '1px solid #E8E8E4',
    padding: '5px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  fileItem__index: {
    width: 40
  },
  fileItem__name: {
    flex: 1
  },
  fileItem__options: {
    flex: 1
  }

});

export default module.exports = File