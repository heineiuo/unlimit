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

class HostFile extends Component {

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
                  <FileInfo
                    pathname={path}
                    injectAsyncReducer={injectAsyncReducer}
                    hostname={hostname}
                    location={location}
                  /> :
                  <div className={css(styles.fileList)}>
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
                                <FileItem
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