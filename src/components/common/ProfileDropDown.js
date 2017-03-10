import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import {Link} from 'react-router'

class ProfileDropDown extends Component {
  static defaultProps = {
    style: {}
  };

  state = {};

  render(){
    const {style} = this.props;
    return (
      <div style={Object.assign({padding: '12px 20px 0', display: 'flex'}, style)}>
        {/*<Link className={css(styles.navItem)} to="/post">写文章</Link>*/}
        <DropDown className={css(styles.navItem)}>
          <DropDownTrigger>
            <div className={css(styles.avatar)}>我</div>
          </DropDownTrigger>
          <DropDownContent>
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

});


export default ProfileDropDown