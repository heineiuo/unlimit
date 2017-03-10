import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import {Link} from "react-router"
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

  render(){
    return (
      <Modal
        contentLabel="createFileModal"
        onRequestClose={this.closeModal}
        style={modalStyle}
        isOpen={this.state.isOpen}>
        <div>新建文件</div>
        <div>
          {
            pickoutPreview(appmeta).map(app => (
              <div key={app.appName} className={css(styles.appTypeItem)}>
                <div>{app.type}</div>
                <div>{app.prettyName}</div>
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
  appTypeItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default CreateFileModal