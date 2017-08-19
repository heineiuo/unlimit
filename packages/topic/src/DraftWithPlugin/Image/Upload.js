import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import Upload from 'rc-upload'

class Uploader extends Component {

  state = {
    urls: []
  }

  uploadSuccess = (result, file) => {
    this.setState({
      urls: result.urls
    })
  }

  render(){
    const {banner} = this.state

    return (
      <Upload
        action="http://yzbt.youkuohao.com/api/file"
        data={{yuokuohao_token: localStorage.youkuohao_token}}
        onSuccess={this.uploadSuccess}>
        <div className={css(styles.uploadBanner)}>
          {
            banner.length === 0?
              '添加封面图':
              <img src={`http://yzbt.youkuohao.com${this.state.banner[0]}`} alt=""/>
          }
        </div>
      </Upload>
    )
  }
}

export default Uploader
