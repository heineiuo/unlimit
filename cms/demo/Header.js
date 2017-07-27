import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'
import {Link} from 'react-router-dom'

class Header extends Component {

  static defaultProps = {
    staticPath: '/home',
    homePath: ''
  }

  render () {
    const {staticPath, homePath} = this.props;

    return (
      <div>
        <div style={{height: 85}}>
          <div className={css(styles.container)}>
            <div className={css(styles.row, styles.spaceBetween)}>
              <div className={css(styles.logobar)} >
                <Link to='/'>
                  <img src={''} alt="" />
                </Link>
              </div>
              <div className={css(styles.pullRight)} style={{height: 34, marginTop: 30}}>
                <img src={''} alt="电话：xxxx" />
              </div>
            </div>

          </div>
        </div>
        <div className="navbar nav-default">
          <div className={css(styles.headerBar)}>
            <div className={css(styles.navbar, styles.container)}>
              <ul className={css(styles.navbar__list)}>
                {
                  [
                    {name: 'xxx', path: '/page/xxx'},
                  ].map(item => (
                    <li className={css(styles.navbar__item)} key={item.name}>
                      <Link className={css(styles.navbar__item__link)} to={item.path}>{item.name}</Link>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
        <div style={{height: 0}} />
      </div>

    )

  }
}

const styles = StyleSheet.create({
  ...commonStyle,
  logobar: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  headerBar: {
    backgroundColor: '#669f36',
    borderTop: '1px solid #669f36',
    borderBottom: '1px solid #669f36',
    height: 50,
  },

  navbar: {
    height: 50
  },
  navbar__list: {
    paddingLeft: 0,
    display: 'flex',
    height: 50,
    lineHeight: '50px',
    margin: 0
  },

  navbar__item: {
    display: 'block',
    listStyle: 'none',
    height: '100%',
    borderRight: '1px solid #8bb568',
    ":hover": {
      backgroundColor: '#8bb568'
    }
  },

  navbar__item__link: {
    color: '#FFF',
    padding: '0 20px',
    textDecoration: 'none'
  }
});

export default Header
