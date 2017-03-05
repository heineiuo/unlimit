import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import Button from "react-sea/lib/Button"
import path from 'path'
import IntegrateApp from "../IntegrateApp"
import Modal from "react-modal"
import utf8 from 'utf8'

class FileInfo extends Component {

  state = {
    showModal: false
  };

  _open = (appName) => {
    this.setState({
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
    const {pathname, injectAsyncReducer, hostname, location, cat} = this.props;
    const extname = path.extname(pathname);
    const type = ['.gif', '.jpg', '.png'].indexOf(extname) > -1 ? 'image':
      'other';

    const matchApp = [
      {appName: 'familytree', prettyName: 'Family Tree'},
      {appName: 'smile-text-editor', prettyName: 'Ace'}
    ];

    const buffer = new Buffer(cat);
    const blobUrl = 'data:image;base64,'+buffer.toString('base64');

    return (
      <div>
        <div className={css(styles.info)}>
          <div>
            <div>文件名：{path.basename(pathname)}</div>
          </div>
          <div>
            <div>预览：</div>
            <div>
              {
                type == 'image'? <img className={css(styles.preview__img)} src={blobUrl} alt=""/>:
                  <div>该文件无法预览</div>
              }
            </div>
          </div>
          <div>
            <div>打开方式：</div>
            <div style={{display: 'flex'}}>
              {
                matchApp.map(app => (
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
                  location={location}
                  path={pathname}
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

  info: {

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


export default module.exports = FileInfo