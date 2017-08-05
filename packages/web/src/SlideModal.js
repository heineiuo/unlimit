import React, {Component} from 'react'
import {Motion, spring} from 'react-motion'
import {StyleSheet, css} from 'aphrodite/no-important'

class SlideModal extends Component {

  static defaultProps = {
    initVisible: false
  };

  componentWillMount = () => {
    const {initVisible} = this.props;
    this.setState({
      visible: initVisible
    })
  };

  open = () => {
    this.setState({
      visible: true
    })
  };

  close = () => {
    this.setState({
      visible: false,
    })
  };

  render () {
    const {children} = this.props;
    const {visible} = this.state;

    return (
      <Motion
        style={{x: spring(visible ? 1 : 0, {stiffness: 250, damping: 25})}}>
        {
          ({x}) =>
            x == 0?
              null:
              <div className={css(styles.mask)} style={{opacity: x}}>
                <div className={css(styles.modal)} style={{
                  // transform: `rotateX(${(1-x)*-90}deg)`,
                  // WebkitTransform: `rotateX(${(1-x)*-90}deg)`,
                  // transformOrigin: 'bottom',
                  // WebkitTransformOrigin: 'bottom',
                  WebkitTransform: `translateY(${(1-x)*300}px)`,
                  transform: `translateY(${(1-x)*300}px)`,
                }} >
                  {children}
                </div>
              </div>
        }
      </Motion>
    )
  }
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
  },
  modal: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 280,
    boxShadow: '0 0 15px #333',
    backgroundColor: '#FFF'
  }
});


export default SlideModal