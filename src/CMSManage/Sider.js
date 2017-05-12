import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite'
import pick from 'lodash/pick'
import {Route, Link} from 'react-router-dom'
import hoverHoc from '../components/hoverHoc'
import trimEnd from 'lodash/trimEnd'

const NavItem = hoverHoc(props => (
  <Route path={props.to} exact={props.activeOnlyWhenExact} children={({match}) => (
    <div className={css(styles.navItem, match && styles.navItem_active)}>
      <Link to={props.to} className={css(styles.navItem__link, (props.hovered || match) && styles.navItem__link_hovered)}>
        {props.name}
      </Link>
    </div>
  )}/>
))

class Sider extends Component {

  render () {
    const safeProps = pick(this.props, ['style', 'className']);
    const displayStyle = this.props.show ? {display: 'block'} : {display: 'none'};
    safeProps.style = Object.assign({}, safeProps.style, displayStyle);
    const {match} = this.props;
    return (
      <div className={css(styles.sider)} {...safeProps}>
        <div style={{width: 240+64}}></div>
        <div className={css(styles.sider__nav)}>
          <div className={css(styles.sider__nav__main)}>
          </div>
          <div className={css(styles.sider__nav__sub)}>
            <NavItem to={`${trimEnd(match.url, '/')}/`} activeOnlyWhenExact={true} name={'主面板'} />
            <NavItem to={`${trimEnd(match.url, '/')}/posts`} name={'文章'} />
            <div className={css(styles.gap)}>其他</div>
            <NavItem to={`${trimEnd(match.url, '/')}/settings`} name={'站点设置'} />
          </div>
        </div>
        
      </div>
    )
  }
}

const styles = StyleSheet.create({
  sider: {
    display: 'flex',
  },

  sider__nav: {
    display: 'flex',
    height: '100%',
    position: 'fixed',
  },
  sider__nav__main: {
    width: 64,
    backgroundColor: '#24292e'
  },

  sider__nav__sub: {
    padding: '24px 8px 0',
    width: 240,
    boxSizing: 'border-box',
    backgroundColor: '#f4f5f7',
  },

  navItem: {
    paddingLeft: 60,
    lineHeight: '40px',
    height: 40,
    color: '#333',
    ":hover": {
      backgroundColor: 'rgba(9,30,66,0.04)'
    }
  },

  navItem_active: {
    backgroundColor: 'rgba(9,30,66,0.04)'
  },

  navItem__link: {
    fontSize: 14,
    letterSpacing: 1,
    display: 'block',
    textDecoration: 'none',
    color: 'rgb(66, 82, 110)'
  },

  navItem__link_hovered: {
    color: 'rgb(0, 82, 204)'
  },

  gap: {
    marginBottom: 8,
    marginLeft: 8,
    marginTop: 16,
    color: '#8993a4',
    fontSize: 12,
    textTransform: 'uppercase',
  }

})

export default Sider
