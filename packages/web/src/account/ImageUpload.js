import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite'
import Upload from 'rc-upload'

class ImageUpload extends Component {
  render  () {
    return (
      <div className={css(styles.imgInfo)}>
        <div className={css(styles.imgUpload)}>
          <Upload {...props}>
            <img className={css(styles.personalImg)} src="" alt="我" />
            <span className={css(styles.imgMask)}>修改头像</span>
          </Upload>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  imgInfo: {
    marginTop: 0,
    textAlign: 'center',
    height: 88,
    width: 88,
    position: 'absolute',
    left: '50%',
    marginLeft: '-44px',
    bottom: -30,
    backgroundColor: '#FFF',
    borderRadius: 111,
    border: '1px solid #EEE',
  },
  imgUpload: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    left: 0,
    right: 0,
    margin: '0 auto',
    position: 'absolute',
    overflow: 'hidden'
  },
  personalImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    borderWidth: '0px',
    border: '0px solid #eaa2a2',
    overflow: 'hidden',
    boxShadow: '0 1px 9px #ccc',
    lineHeight: '80px',
    fontSize: '30px',
    color: '#bf7474',
    backgroundColor: '#fff',
    transform: 'scale(1.05)',
  },

  imgMask: {
    lineHeight: '88px',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    background: 'rgba(0,0,0,0.2)',
    opacity: 0,
    left: 0,
    top: 0,
    display: 'inline-block',
    position: 'absolute',
    width: '100% !important',
    height: '100% !important',
    borderRadius: '50%',
    cursor: 'pointer',
    ':hover': {
      opacity: 1
    }
  }


});


const props = {
  action: '/upload.do',
  data: { a: 1, b: 2 },
  headers: {
    Authorization: 'xxxxxxx',
  },
  multiple: true,
  onSuccess(ret) {
    console.log('onSuccess', ret);
  },

  onError(err) {
    console.log('onError', err);
  },
};

export default ImageUpload
