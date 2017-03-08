import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import Button from "react-sea/lib/Button"
import path from 'path'
import IntegrateApp from "../IntegrateApp"
import Modal from "react-modal"
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

  closeModal = () => {
    this.setState({
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
      <div>
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
            <div>
              {
                (matchApp.length == 0 || matchApp[0].type != 'image')? <div>该文件无法预览</div>:
                  <img className={css(styles.preview__img)} src={blobUrl} alt=""/>
              }
            </div>
          </div>

        </div>
        <Modal
          overlayClassName={css(styles.modal__overlay)}
          className={css(styles.modal__content)}
          isOpen={this.state.showModal}
          contentLabel="IntegrateAppModal">
          {
            !this.state.showModal ? null : (
              <div>
                {/*<a*/}
                {/*href={`${THIS_HOST}/#/integrateapp/smile-text-editor?hostname=${host.hostname}&path=${pathname}`}*/}
                {/*target="_blank">text editor</a>*/}
                <IntegrateApp
                  pathname={pathname}
                  hostname={hostname}
                  injectAsyncReducer={injectAsyncReducer}
                  appName={this.state.appName}
                />
                <div onClick={this.closeModal} className={css(styles.modal__closeBtn)}>关闭应用</div>

              </div>
            )
          }
        </Modal>
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
    flex: 1
  },

  preview__img: {
    maxWidth: '100%'
  },

  modal__closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFF',
    padding: '4px 10px',
    zIndex: 1000,
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