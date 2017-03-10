import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import {Link} from "react-router"
import Button from "react-sea/lib/Button"
import Upload from "rc-upload"
import {setTitle} from "../../store/nav"
import {getFileList} from "../../store/file"
import Spin from "react-spin"
import urlencode from "form-urlencoded"
import FileItem from './FileItem'
import FilePathBar from './FilePathBar'
import FileInfo from './FileInfo'
import CreateFileModal from './CreateFileModal'

class HostFile extends Component {

  state = {
    selected: []
  };

  componentWillMount = () => {
    const {setTitle, getFileList, params: {hostname, splat}} = this.props;
    getFileList(hostname, splat);
  };

  componentWillReceiveProps = (nextProps) => {
    const {getFileList, setTitle, params: {hostname, splat}, host} = this.props;
    const nextPath = nextProps.params.splat;

    if (nextProps.file.fileState == 0) {
      setTitle(`${nextProps.params.hostname} - 文件`);
      return getFileList(params.hostname, '/');
    }

    if (nextPath != splat) {
      getFileList(hostname, nextPath)
    }
  };

  componentWillUnmount = () => {
    console.error('\<HostFile \/\> will unmounted')
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
    const {setTitle, getFileList, host, params: {hostname, splat}} = this.props;
    getFileList(hostname, splat);
    setTitle(`${hostname} - 文件`);
  };

  openCreateFileModal = () => {
    this.createFileModal.open();
  };

  render() {
    const {selected} = this.state;
    const {
      file,
      file: {isFile, cat, ls},
      account,
      params: {hostname, splat},
      injectAsyncReducer
    } = this.props;
    const path = splat || '/';
    const hrefPrefix = `/drive/${hostname}`;

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
                <FilePathBar
                  isFile={isFile}
                  driveName={hostname}
                  hrefPrefix={hrefPrefix}
                  pathname={path} />
                <div className={css(styles.headerBar__tools)} style={isFile?{display: 'none'}:{}}>
                  {/*选中操作*/}
                  {
                    selected.length == 0 ? null:
                      <div className={css(styles.headerBar__toolItem)}>
                        <span>删除</span>
                        <span>移动</span>
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
                isFile ?
                  <FileInfo
                    cat={cat}
                    pathname={path}
                    injectAsyncReducer={injectAsyncReducer}
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
                                  index={index}
                                  path={path}
                                  item={item} />
                              ))
                            }
                          </div>
                        </div>
                    }
                    <CreateFileModal ref={ref => this.createFileModal = ref}/>
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


export default module.exports = HostFile