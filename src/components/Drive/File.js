import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import {Link} from "react-router-dom"
import Button from "react-sea/lib/Button"
import Upload from "rc-upload"
import Spin from "react-spin"
import urlencode from "form-urlencoded"
import FileItem from './FileItem'
import FilePathBar from './FilePathBar'
import FileInfo from './FileInfo'
import CreateFileModal from './CreateFileModal'
import IntegrateApp from "../common/IntegrateApp"
import {injectAsyncReducer} from '../../store'

import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {bindActionCreators} from 'redux'
import {
  createHost, getHostList, deleteHost,
  getLocations, commitLocations
} from '../../store/host'
import {restoreFileList, getFileList, deleteFile} from '../../store/file'
import {setTitle} from '../../store/nav'


class File extends Component {

  state = {
    selected: [],
    isIntegrateAppOpen: false,
  };

  getSplat = (props) => {
    const {location: {pathname}, match: {url}} = props || this.props;
    return pathname.substring(url.length)
  };

  componentWillMount = () => {
    const {setTitle, getFileList, match, match: {params: {hostname}}} = this.props;
    console.log(match);
    getFileList(hostname, this.getSplat());
  };

  componentWillReceiveProps = (nextProps) => {
    const {getFileList, setTitle, match, host} = this.props;
    const {params, params: {hostname}} = match;

    const nextPath = this.getSplat(nextProps);

    if (nextProps.file.fileState == 0) {
      setTitle(`${nextProps.params.hostname} - 文件`);
      return getFileList(nextProps.params.hostname, '/');
    }

    if (nextPath != this.getSplat()) {
      getFileList(hostname, nextPath)
    }
  };

  componentWillUnmount = () => {
    console.error('\<File \/\> will unmounted')
  };

  handleFileToggleSelect = (toggle, file) => {
    const {selected} = this.state;
    if (toggle == 0) {
      this.setState({
        selected: selected.slice().filter(item => {
          return item.name != file.name
        })
      })
    } else {
      this.setState({
        selected: selected.slice().concat(file)
      })
    }

  };

  _handleUploadSuccess = () => {
    const {setTitle, getFileList, host, match} = this.props;
    const {params: {hostname}} = match;

    getFileList(hostname, this.getSplat());
    setTitle(`${hostname} - 文件`);
  };

  openCreateFileModal = () => {
    this.createFileModal.open();
  };

  openIntegrateApp = (options) => {
    this.integrateApp.open(options);
    this.setState({
      isIntegrateAppOpen: true
    })
  };

  handleCloseIntegrateApp = () => {
    this.setState({
      isIntegrateAppOpen: false
    })
  };

  deleteFile = (item) => {
    const {name} = item;
    const {match: {params: {hostname, splat}}} = this.props;
    const pathname = splat || '/';
    const willDeletePathname = `${pathname=="/"?'':pathname}/${item.name}`;
    if (window.confirm(`是否删除${willDeletePathname}`)){
      this.props.deleteFile(hostname, willDeletePathname)
    }
  };

  render() {
    const {selected, isIntegrateAppOpen} = this.state;
    const {
      file,
      file: {isFile, cat, ls},
      account,
      match: {params: {hostname}},
    } = this.props;
    const pathname = this.getSplat() || '/';
    const hrefPrefix = `/drive/${hostname}`;

    const uploadAction = `/api/gateway?${urlencode({
      importAppName: 'gateway',
      token: account.token,
      reducerName: 'file',
      action: 'upload',
      hostname,
      pathname
    })}`;

    return (

      <div>
        {
          file.fileState < 2 ?
            <div style={{height: 300}}>
              <Spin />
            </div> :
            <div>
              <div className={css(styles.headerBar)}>
                <FilePathBar
                  isFile={isFile}
                  driveName={hostname}
                  hrefPrefix={hrefPrefix}
                  pathname={pathname} />
                <div className={css(styles.headerBar__tools)} style={(isFile || isIntegrateAppOpen)?{display: 'none'}:{}}>
                  {/*选中操作*/}
                  {
                    selected.length == 0 ? null:
                      <div className={css(styles.headerBar__toolItem)}>
                        <span>批量删除</span>
                      </div>
                  }
                  {/*展示样式*/}
                  <div className={css(styles.headerBar__toolItem)} style={{border: '1px solid #AAA'}}>
                    <span>列表</span>|
                    <span>图标</span>
                  </div>
                  {/*剪贴板*/}
                  <div className={css(styles.headerBar__toolItem)} style={{border: '1px solid #AAA'}}>
                    <span>添加到剪贴板</span>
                    <span>v</span>
                  </div>
                  {/*上传*/}
                  <div className={css(styles.headerBar__toolItem)}>
                    <Upload
                      onSuccess={this._handleUploadSuccess}
                      action={uploadAction}>
                      <Button type="primary" size="small">上传文件</Button>
                    </Upload>
                  </div>
                  {/*新建文件*/}
                  <div className={css(styles.headerBar__toolItem)}>
                    <Button onClick={this.openCreateFileModal} type="primary" size="small">新建文件</Button>
                  </div>
                </div>
              </div>
              {
                isIntegrateAppOpen ? null:
                  isFile ?
                    <FileInfo
                      cat={cat}
                      pathname={pathname}
                      isIntegrateAppOpen={isIntegrateAppOpen}
                      openIntegrateApp={this.openIntegrateApp}
                      hostname={hostname}
                    /> :
                    <div className={css(styles.fileList)}>
                      {
                        !ls.length ?
                          <div>目录为空</div> :
                          <div>
                            <div className={css(styles.listViewBar)}>
                              <div className={css(styles.listViewBar__index)}>选中</div>
                              <div className={css(styles.listViewBar__name)}>名称</div>
                              <div className={css(styles.listViewBar__size)}>大小</div>
                              <div className={css(styles.listViewBar__options)}>操作</div>
                            </div>
                            <div>
                              {
                                file.ls.map((item, index) => (
                                  <FileItem
                                    onToggleSelect={this.handleFileToggleSelect}
                                    hrefPrefix={hrefPrefix}
                                    key={item.name}
                                    deleteFile={this.deleteFile}
                                    index={index}
                                    pathname={pathname}
                                    item={item} />
                                ))
                              }
                            </div>
                          </div>
                      }
                      <CreateFileModal
                        ref={ref => this.createFileModal = ref}
                        pathname={pathname}
                        isIntegrateAppOpen={isIntegrateAppOpen}
                        openIntegrateApp={this.openIntegrateApp}
                        hostname={hostname}
                      />
                    </div>
              }
              <IntegrateApp
                ref={ref => this.integrateApp = ref}
                injectAsyncReducer={injectAsyncReducer}
                onClose={this.handleCloseIntegrateApp}
              />
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
    padding: '10px 0px',
    borderBottom: '1px solid #EEE'
  },

  headerBar__tools: {
    display: 'flex',
    flexDirection: 'row',
  },

  headerBar__toolItem: {
    flex: 1,
    whiteSpace: 'nowrap'
  },

  listViewBar: {
    display: 'flex',
    padding: '5px 10px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F5'
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

  fileList: {

  },


});


const connectedFile = connect(
  (state) => ({
    account: state.account,
    host: state.host,
    file: state.file,
  }),
  (dispatch) => bindActionCreators({
    push,
    getFileList,
    deleteFile,
    setTitle,
    getHostList,
    restoreFileList,
  }, dispatch)
)(File);

export default module.exports = connectedFile
