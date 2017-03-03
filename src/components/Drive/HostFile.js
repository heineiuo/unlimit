import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import {Link} from "react-router"
import Button from "react-sea/lib/Button"
import Upload from "rc-upload"
import {setTitle} from "../../store/nav"
import {getFileList} from "../../store/file"
import Spin from "react-spin"
import {THIS_HOST} from "../../constants"
import modulePath from "path"
import urlencode from "form-urlencoded"
import filesize from "filesize"
import IntegrateApp from "../IntegrateApp"
import Modal from "react-modal"

class File extends Component {

  state = {
    showModal: false
  };

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

  _handleUploadSuccess = () => {

    const {setTitle, getFileList, host, location} = this.props;
    getFileList(location.query.path);
    setTitle(`${host.hostname} - 文件`);
  };

  _open = (appName) => {
    this.setState({
      appName,
      showModal: true
    })
  };

  render() {

    const {
      file,
      file: {isFile, cat, ls},
      location,
      host,
      host: {hostname},
      account,
      params,
      injectAsyncReducer
    } = this.props;
    const path = location.query.path || '/';
    const hrefPrefix = `/drive/${hostname}`;
    const parsed = path.split('/').filter(item => item != '');

    const uploadAction = `/api/gateway?${urlencode({
      importAppName: 'gateway',
      token: account.token,
      reducerName: 'file',
      action: 'upload',
      hostname,
      pathname: path
    })}`;

    return (

      <div>
        {
          file.fileState < 2 ?
            <Spin /> :
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
                                <span className={css(styles.headerBar__path__dirname)}>{dirname}</span> :
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
                    <Upload
                      onSuccess={this._handleUploadSuccess}
                      action={uploadAction}>
                      <div style={{width: 80}}>
                        <Button type="primary" size="small">上传文件</Button>
                      </div>
                    </Upload>
                  </div>
                  {/*选中操作*/}
                </div>
              </div>
              {
                isFile ?
                  // TODO 不集成编辑工具，只显示文件基本信息，并显示支持编辑此文件的程序列表。
                  <div className="file">
                    <div>
                      <div>文件名：{modulePath.basename(path)}</div>
                      <div>打开方式：</div>
                      <div>
                        <a
                          href={`${THIS_HOST}/#/integrateapp/smile-text-editor?hostname=${host.hostname}&path=${path}`}
                          target="_blank">text editor</a>
                        <div>
                          <Button onClick={() => this._open('smile-text-editor', path)}>在弹窗中打开</Button>
                        </div>
                      </div>
                      {/*<TextEditor text={cat} ref={(editor) => this.editor = editor}/>*/}
                    </div>
                    <Modal
                      overlayClassName={css(styles.modal__overlay)}
                      className={css(styles.modal__content)}
                      isOpen={this.state.showModal}
                      contentLabel="IntegrateAppModal"
                      ref={ref => this.modal = ref}>
                      {
                        !this.state.showModal ? null :
                          <IntegrateApp
                            location={location}
                            path={path}
                            hostname={hostname}
                            injectAsyncReducer={injectAsyncReducer}
                            appName={this.state.appName}
                          />
                      }
                    </Modal>
                  </div> :
                  <div className="directory">
                    <div className={styles.fileList}>
                      {
                        !ls.length ?
                          <div>目录为空</div> :
                          <div>
                            <div className={css(styles.listViewBar)}>
                              <div className={css(styles.listViewBar__index)}>序号</div>
                              <div className={css(styles.listViewBar__name)}>名称</div>
                              <div className={css(styles.listViewBar__size)}>大小</div>
                              <div className={css(styles.listViewBar__options)}>操作</div>
                            </div>
                            <div>
                              {
                                file.ls.map((item, index) => (
                                  <div key={item.name} className={css(styles.fileItem)}>
                                    <div className={css(styles.fileItem__index)}>{index + 1}</div>
                                    <div className={css(styles.fileItem__name)}>
                                      <Link
                                        className={css(styles.fileItem__name__text)}
                                        to={`${hrefPrefix}?path=${path=="/"?'':path}/${item.name}`}>{item.name}</Link>
                                    </div>
                                    <div className={css(styles.fileItem__size)}>
                                      {filesize(item.stat.size)}
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
  listViewBar__size: {
    flex: 1,
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
    flex: 1,
  },
  fileItem__name__text: {
    color: '#1077ff',
    textDecoration: 'none',
    fontSize: 15,
    letterSpacing: 1
  },
  fileItem__size: {
    flex: 1
  },
  fileItem__options: {
    flex: 1
  },

  // modal
  modal__content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: 0,
    overflow: 'auto',
    overflowScrolling: 'touch',
  },

  modal__overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }

});


export default module.exports = File