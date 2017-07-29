import React, {Component} from 'react'
import Modal from 'react-modal'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class Notice extends Component {

  state = {
    stack: [],
    modalOpen: false
  };

  timeToClearThisError = (id) => {
    setTimeout(() => {
      const nextStack = this.state.stack.slice().filter(item => item.id !== id )
      this.setState({
        stack: nextStack,
        modalOpen: nextStack.length > 0
      })
    }, 4000)
  };

  componentWillReceiveProps = (nextProps) => {
    const {stack} = this.state
    const that = this
    if (nextProps.notice.stack.length > 0) {
      const nextStack = stack.slice()
      nextProps.notice.stack.forEach(item => {
        that.timeToClearThisError(item.id)
        nextStack.push(item)
      });
      this.setState({
        modalOpen: true,
        stack: nextStack
      });
      this.props.actions.clearStoreNotice()
    }
  };

  requestCloseFn = () => {
    this.setState({
      modalOpen: false
    })
  };

  render () {

    if (!this.state.modalOpen) return null

    return (
      <Modal
        contentLabel="notice"
        onRequestClose={this.requestCloseFn}
        style={modalStyle}
        shouldCloseOnOverlayClick={false}
        isOpen={this.state.modalOpen} >
        {
          this.state.stack.map((item, index) => (
            <div
              style={noticeStyle}
              key={index}>{item.title}</div>
          ))
        }
      </Modal>
    )

  }
}


const modalStyle = {
  overlay : {
    position: 'fixed',
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: 'transparent'
  },
  content : {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    padding: 0,
    margin: 0,
    border: 0,
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    outline: 'none',
    backgroundColor: 'transparent'
  }
};

const noticeStyle = {
  margin: '4px 0',
  maxWidth: 200,
  backgroundColor: 'rgb(244, 67, 54)',
  padding: '10px 20px',
  color: '#fff'
};

export default module.exports = connect(
  (state) => ({
    notice: state.notice,
  }),
  (dispatch) => bindActionCreators({

  }, dispatch)
)(Notice)
