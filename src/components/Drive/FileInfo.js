import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import Button from "react-sea/lib/Button"
import path from 'path'
import IntegrateApp from "../IntegrateApp"
import Modal from "react-modal"

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

  render(){
    const {pathname, injectAsyncReducer, hostname, location} = this.props;

    return (
      <div>
        <div>
          <div>文件名：{path.basename(pathname)}</div>
          <div>打开方式：</div>
          <div>
            {/*<a*/}
              {/*href={`${THIS_HOST}/#/integrateapp/smile-text-editor?hostname=${host.hostname}&path=${pathname}`}*/}
              {/*target="_blank">text editor</a>*/}
            <div>
              <Button style={{width: 100}} onClick={() => this._open('smile-text-editor', pathname)}>Ace</Button>
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
            !this.state.showModal ? null :
              <IntegrateApp
                location={location}
                path={pathname}
                hostname={hostname}
                injectAsyncReducer={injectAsyncReducer}
                appName={this.state.appName}
              />
          }
        </Modal>
      </div>
    )
  }
}


const styles = StyleSheet.create({

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