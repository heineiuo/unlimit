import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import {Link} from "react-router-dom"
import Modal from 'react-modal'
import {appmeta, pickoutPreview} from './appmeta'

class CreateFileModal extends Component {

  state = {
    isOpen: false
  };

  open = () => {
    this.setState({
      isOpen: true
    })
  };

  closeModal = () => {
    this.setState({
      isOpen: false
    })
  };

  openApp = (app) => {
    const {appName} = app;
    const {openIntegrateApp, driveId, pathname} = this.props;
    openIntegrateApp({
      appName,
      isCreated: false,
      driveId,
      pathname
    })
  };

  render(){
    return (
      <Modal
        contentLabel="createFileModal"
        onRequestClose={this.closeModal}
        style={modalStyle}
        isOpen={this.state.isOpen}>
        <div className={css(styles.title)}>选择App创建文件</div>
        <div>
          <div className={css(styles.appTypeItem)}>
            <div>创建文件夹</div>
          </div>
        </div>
        <div>
          {
            pickoutPreview(appmeta).map(app => (
              <div
                onClick={() => this.openApp(app)}
                key={app.appName}
                className={css(styles.appTypeItem)}>
                <div>{app.prettyName}</div>
                <div style={{color: '#999'}}>支持: {app.support.join(', ')}</div>
              </div>
            ))
          }
        </div>
      </Modal>
    )
  }
}

const modalStyle = {
  overlay : {
    zIndex: 1000,
    position : 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '380px',
    padding: '0px',
    borderRadius: 0,
    border:0,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: 'rgb(82, 89, 103)',
    padding: '10px 30px',
    textAlign: 'center',
    color: '#FFF'
  },
  appTypeItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0px 20px',
    height: '50px',
    boxSizing: 'border-box',
    lineHeight: '50px',
    cursor: 'pointer',
    borderBottom: '1px solid #EEE',
    justifyContent: 'space-between',
    ":hover": {
      backgroundColor: '#F8F8F8'
    }
  }
});

export default CreateFileModal