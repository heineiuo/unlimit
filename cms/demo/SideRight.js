import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'

class SideRight extends Component {

  render () {

    const {homePath, staticPath} = this.props;

    return (
      <div>
        <div className="block block-news">
          <div className="title">
            新闻中心
            <div className={css(styles.pullRight)}>
              <a href={`${homePath}/news`} className={css(styles.colorGreen)}>更多</a>
            </div>
          </div>

          <ul>
            <li ><a href="/post/49">xxxxxx</a></li>
            <li ><a href="/post/49">xxxxxx</a></li>
            <li ><a href="/post/49">xxxxxx</a></li>
          </ul>
        </div>

        <div className="block block-products">
          <div className={css(styles.title)}>
            联系方式
            <div className={css(styles.pullRight)}>
              <Link to='/contact' style={{color: '#669f36'}}>更多</Link>
            </div>
          </div>
          <div style={{padding: 10, color: '#669f36'}}>
          </div>
        </div>
      </div>
    )

  }
}
const styles = StyleSheet.create({
  ...commonStyle,

  title: {
    padding: '0 10px',
    backgroundColor: '#b9dc91',
    lineHeight: '35px',
    color: '#669f36'
  }
});


export default module.exports = SideRight
