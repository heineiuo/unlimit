import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import Button from "react-sea/lib/Button"
import path from 'path'
import IntegrateApp from "../IntegrateApp"
// import Modal from "react-modal"
// import utf8 from 'utf8'

const matchAppByPathname = (pathname) => {
  const extname = path.extname(pathname);
  const all = [
    {appName: 'preview', type: 'image', support: ['.png', '.jpg', '.gif', '.jpeg']},
    {appName: 'familytree', type: 'graph', prettyName: 'Family Tree', support: ['.familytree']},
    {appName: 'smile-text-editor', type: 'code', prettyName: 'Ace', support: ['.js', '.html', '.css', '.json', '.xml', '']}
  ];
  const result = [];
  all.forEach(item => {
    if (item.support.indexOf(extname) > -1 ) {
      result.push(item)
    }
  });
  return result;
};

class FileInfo extends Component {

  state = {
    infoState: 0, // 0 preview, 1 edit, 2, edit in full screen
    showModal: false
  };

  _open = (appName) => {
    this.setState({
      infoState: 1,
      appName,
      showModal: true
    })
  };

  toggleFullScreen = () => {
    const {infoState} = this.state;
    this.setState({
      infoState: infoState == 0? 0: infoState==1?2:1
    })
  };

  closeEdit = () => {
    this.setState({
      infoState: 0,
      appName: null,
      showModal: false,
    })
  };

  render(){
    const {pathname, injectAsyncReducer, hostname, cat} = this.props;
    const matchApp = matchAppByPathname(pathname);
    const {infoState} = this.state;

    const buffer = new Buffer(cat);
    const blobUrl = 'data:image;base64,'+buffer.toString('base64');

    return (
      <div style={{paddingTop: 10}}>
        <div className={css(styles.fileInfo, infoState == 0 && styles.fileInfo_show)}>
          <div className={css(styles.info)}>
            <div>
              <div>文件名：{path.basename(pathname)}</div>
            </div>
            <div>
              <div>打开方式：</div>
              <div style={{display: 'flex'}}>
                {
                  matchApp.filter(item => item.appName != 'preview').map(app => (
                    <div
                      style={{padding: 2}}
                      key={app.appName}>
                      <Button
                        style={{width: 100}}
                        onClick={() => this._open(app.appName, pathname)}>
                        {app.prettyName}
                      </Button>
                    </div>
                  ))
                }
              </div>
            </div>
            {/*<TextEditor text={cat} ref={(editor) => this.editor = editor}/>*/}
          </div>
          <div className={css(styles.preview)}>
            <div>预览：</div>
            <div className={css(styles.preview__box)}>
              {
                (matchApp.length == 0 || matchApp[0].type != 'image')?
                  <div className={css(styles.preview__normal)}>{matchApp[0].type}</div>:
                  <img className={css(styles.preview__img)} src={blobUrl} alt=""/>
              }
            </div>
          </div>

        </div>
        {
          infoState == 0 ? null:
            <div className={css(styles.edit, infoState == 2 && styles.edit_fullScreen)}>
              {/*<a*/}
              {/*href={`${THIS_HOST}/#/integrateapp/smile-text-editor?hostname=${host.hostname}&path=${pathname}`}*/}
              {/*target="_blank">text editor</a>*/}

              <div className={css(styles.appToolBar)} style={infoState==2?{position: 'absolute'}:{}}>
                <div onClick={this.toggleFullScreen} className={css(styles.appToolBar__btn)}>全屏</div>
                <div onClick={this.closeEdit} className={css(styles.appToolBar__btn)}>关闭应用</div>
              </div>
              <IntegrateApp
                pathname={pathname}
                hostname={hostname}
                injectAsyncReducer={injectAsyncReducer}
                appName={this.state.appName}
              />
            </div>

        }
      </div>

    )
  }
}


const styles = StyleSheet.create({

  fileInfo: {
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start'
  },

  fileInfo_show: {
    display: 'flex'
  },

  info: {
    width: 300
  },

  preview: {
    flex: 1,
  },

  preview__box: {
    border: '1px solid #E9E9E9'
  },

  preview__normal: {
    height: '300px',
    lineHeight: '300px',
    textAlign: 'center'
  },

  preview__img: {
    maxWidth: '100%'
  },


  edit: {
    display: 'block'
  },

  edit_fullScreen: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#FFF',
    zIndex: 2000,
  },

  ///////////

  appToolBar: {
    display: 'flex',
    flexDirection: 'flex-end',
    alignItems: 'center',
    zIndex: 1001
  },

  appToolBar__btn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFF',
    padding: '4px 10px',
    cursor: 'pointer'
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


export default FileInfo