import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import DropDown, {DropDownTrigger, DropDownContent} from '@react-web/dropdown'
import {Link} from 'react-router-dom'

class ProfileDropDown extends Component {
  static defaultProps = {
    style: {}
  };

  state = {};

  render(){
    const {style} = this.props;
    return (
      <div style={Object.assign({alignSelf: 'center', display: 'flex'}, style)}>
        {/*<Link className={css(styles.navItem)} to="/post">写文章</Link>*/}
        <DropDown className={css(styles.navItem)}>
          <DropDownTrigger>
            <div className={css(styles.avatar)}>我</div>
          </DropDownTrigger>
          <DropDownContent className={css(styles.panel)}>
            <Link to="/account">账号</Link>
          </DropDownContent>
        </DropDown>
      </div>
    )
  }
}


const styles = StyleSheet.create({

  navItem: {
    padding: '0 12px',
    textDecoration: 'none',
    lineHeight: `${32}px`,
    color: 'rgba(103,103,139,.8)'
  },

  navItem_active: {
    color: '#1185fe'
  },

  avatar: {
    borderRadius: 20,
    width: 32,
    height: 32,
    backgroundColor: '#83121a',
    lineHeight: `${32}px`,
    textAlign: 'center',
    color: '#FFF'
  },

  panel: {
    position: 'absolute',
    backgroundColor: '#FFF',
    marginTop: 10,
  }

});


export default ProfileDropDown