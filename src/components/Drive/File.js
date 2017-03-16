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
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import IconArrowDropdown from '../common/IconArrowDropdown'

import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {bindActionCreators} from 'redux'
import {
  createHost, getHostList, deleteHost,
  getLocations, commitLocations
} from '../../store/host'
import {
  restoreFileList, getFileList, deleteFile,
  pushFileToClipboard,
  emptyClipboard,
} from '../../store/file'
import {setTitle} from '../../store/nav'


class File extends Component {

  state = {
    selected: [],
    isIntegrateAppOpen: false,
  };
  fileRefs = {};

  getSplat = (props) => {
    const {location: {pathname}, match: {url}} = props || this.props;
    return pathname.substring(url.length)
  };

  componentWillMount = () => {
    const {setTitle, getFileList, match, match: {params: {hostname}}} = this.props;
    // console.log(match);
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
    console.log(toggle, this.state.selected, file)
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

  unSelectAll = () => {
    const {selected} = this.state;
    selected.forEach(file => {
      this.fileRefs[file.name]._toggleSelect(0)
    });
    this.selectorDropDown.hide();
    this.setState({
      selected: []
    });
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

  openCreateDirectoryModal = () => {

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

  deleteFile = ({name}) => {
    const {match: {params: {hostname}}} = this.props;
    const pathname = this.getSplat(this.props) || '/';
    const willDeletePathname = `${pathname=="/"?'':pathname}/${name}`;
    if (window.confirm(`是否删除${willDeletePathname}`)){
      this.props.deleteFile(hostname, willDeletePathname)
    }
  };

  pushSelectedFileToClipboard = () => {
    const files = this.state.selected.map(file => {
      console.log(this.getSplat(this.props), file.name);
      return `${this.getSplat(this.props)}/${file.name}`;
    })
    // return console.log(files)
    this.props.pushFileToClipboard(files)
  };

  render() {
    const {file: {clipboard}, emptyClipboard} = this.props;
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
                {/*路径栏*/}
                <FilePathBar
                  isFile={isFile}
                  driveName={hostname}
                  hrefPrefix={hrefPrefix}
                  pathname={pathname} />
                {/*工具栏*/}

                <div className={css(styles.headerBar__tools)} style={(isFile || isIntegrateAppOpen)?{display: 'none'}:{}}>
                  {/*展示样式*/}
                  {/*<div className={css(styles.headerBar__toolItem)}>*/}
                    {/*<span>列表</span>|*/}
                    {/*<span>图标</span>*/}
                  {/*</div>*/}

                  {/*选中操作*/}
                  <div className={css(styles.headerBar__toolItem)}>
                    <DropDown ref={ref => this.selectorDropDown = ref} className={css(styles.clipboard)}>
                      <DropDownTrigger style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
                        <Button type="primary" size="small" style={{userSelect: 'none'}}>
                          {
                            selected.length > 0 ? `选中文件(${selected.length})`
                              : '选中文件'
                          }
                          <IconArrowDropdown />
                        </Button>
                      </DropDownTrigger>
                      <DropDownContent className={css(styles.clipboard__content)}>
                        {
                          selected.length == 0 ? <div>未选择文件</div>: (
                            <div>
                              <div className={css(styles.clipboard__info)} onClick={this.unSelectAll}>取消选择</div>
                              <div className={css(styles.clipboard__info)} style={{color: '#EE2222'}}>删除</div>
                              <div
                                onClick={this.pushSelectedFileToClipboard}
                                className={css(styles.clipboard__info)}>添加到剪贴板</div>
                            </div>
                          )
                        }
                      </DropDownContent>
                    </DropDown>
                  </div>

                  {/*剪贴板*/}
                  <div className={css(styles.headerBar__toolItem)}>
                    <DropDown ref={ref => this.dropDown = ref} className={css(styles.clipboard)}>
                      <DropDownTrigger style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
                        <Button type="primary" size="small" style={{userSelect: 'none'}}>
                          {
                            clipboard.length > 0 ? `剪贴板(${clipboard.length})`: '剪贴板'
                          }
                          <IconArrowDropdown />
                        </Button>
                      </DropDownTrigger>
                      <DropDownContent className={css(styles.clipboard__content)}>
                        <div className={css(styles.triangle)}></div>
                        <div className={css(styles.clipboard__info)}>
                          {
                            clipboard.length == 0 ? (
                              <div>剪贴板为空</div>
                            ) :
                              clipboard.map(filename => (
                                <div key={filename}>{filename}</div>
                              ))
                          }
                        </div>
                        {
                          clipboard.length == 0 ? null: (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                              <span className={css(styles.clipboard__item)}>复制到此</span>
                              <span className={css(styles.clipboard__item)}>移动到此</span>
                              <span
                                className={css(styles.clipboard__item)}
                                onClick={emptyClipboard}
                              >清空剪贴板</span>
                            </div>
                          )
                        }
                      </DropDownContent>
                    </DropDown>
                  </div>
                  {/*创建文件、文件夹以及上传文件*/}
                  <div className={css(styles.headerBar__toolItem)}>
                    <DropDown ref={ref => this.dropDown = ref} className={css(styles.clipboard)}>
                      <DropDownTrigger style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
                        <Button type="primary" size="small" style={{userSelect: 'none'}}>
                          {`创建`}
                          <IconArrowDropdown />
                        </Button>
                      </DropDownTrigger>
                      <DropDownContent className={css(styles.clipboard__content)}>
                        <div onClick={this.openCreateFileModal}>文件</div>
                        <div onClick={this.openCreateDirectoryModal}>文件夹</div>
                        <Upload
                          style={{display: 'flex'}}
                          onSuccess={this._handleUploadSuccess}
                          action={uploadAction}>上传文件</Upload>
                      </DropDownContent>
                    </DropDown>
                  </div>
                </div>
                {/*end of tools*/}
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
                                    ref={ref => this.fileRefs[item.name] = ref}
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
    whiteSpace: 'nowrap',
    marginLeft: 2,
    display: 'flex'
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
    flex: 2
  },
  listViewBar__size: {
    flex: 1,
  },
  listViewBar__options: {
    flex: 1
  },

  fileList: {

  },

  clipboard: {
    display: 'flex',
    cursor: 'pointer'
  },

  clipboard__content: {
    display: 'flex',
    position: 'absolute',
    marginTop: 14,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    border: '1px solid #DDD',
    borderRadius: 2,
  },
  triangle: {
    position: 'absolute',
    left: '50%',
    width: 0,
    height: 0,
    marginLeft: '-10px',
    marginTop: '-20px',
    border: '10px solid transparent',
    borderBottomColor: '#FFF'
  },

  clipboard__info: {
    padding: '5px 20px',
    borderBottom: '1px solid #EEE'
  },

  clipboard__item: {
    padding: '0 20px',
    height: '30px',
    color: '#665445',
    lineHeight: '30px',
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#1077ff',
      color: '#FFF'
    }
  }

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
    pushFileToClipboard,
    emptyClipboard
  }, dispatch)
)(File);

export default module.exports = connectedFile
