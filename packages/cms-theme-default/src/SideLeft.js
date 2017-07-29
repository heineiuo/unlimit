import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'

class SideLeft extends Component {

  static defaultProps = {
    homePath: '',
    staticPath: '/home'
  }

  render () {
    const {homePath, staticPath, match} = this.props
    return (
      <div>
        <div className="block block-products">
          <div className="title">
            园艺产品
            <div className={css(styles.pullRight)}>
              <Link to='/tag/xxx' className={css(styles.colorGreen)}>更多</Link>
            </div>
          </div>
          <ul style={{padding: '20px 0'}}>
            <li><Link className={css(styles.block__link)} to="/post/36">● xxxx</Link></li>
          </ul>
        </div>
        <div className="block block-products">
          <div className={css(styles.title)}>
            xxxxx
            <div className={css(styles.pullRight)}>
              <Link to='/page/xxxx' style={{color: '#669f36'}}>更多</Link>
            </div>
          </div>
          <div style={{padding: 10, color: '#669f36'}}>
            xxxxx
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
  },

  block__link: {
    display: 'block',
    lineHeight: '40px',
    backgroundColor: '#fff',
    marginBottom: 5,
    padding: '0 10px',
    fontSize: 16,
  }

});


export default module.exports = SideLeft
