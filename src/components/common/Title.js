import React, {Component} from "react"
import {Link} from "react-router-dom"
import {css, StyleSheet} from "aphrodite/no-important"
import {Logo} from "react-sea/lib/Smile"
import DropDown, {DropDownContent, DropDownTrigger} from "react-sea/lib/DropDown"

class Title extends Component {

  static defaultProps = {
    color: '#666',
    style: {},
    title: "右括号"
  };

  closeContent = () => {
    this.dropDown.toggle(false)
  };

  render() {
    const {title, color, style} = this.props;
    return (
      <DropDown ref={ref => this.dropDown = ref} className={css(styles.title)} style={style}>
        <DropDownTrigger style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
          <Logo color={color} />
          <div style={{color, userSelect: 'none'}}>{title}</div>
        </DropDownTrigger>
        <DropDownContent className={css(styles.title__content)}>
          <div className={css(styles.triangle)}></div>
          <Link onClick={this.closeContent} className={css(styles.link)} to="/">右括号</Link>
          <Link onClick={this.closeContent} className={css(styles.link)} to="/drive">协作空间</Link>
          <Link onClick={this.closeContent} className={css(styles.link)} to="/account">账号</Link>
          <Link onClick={this.closeContent} className={css(styles.link)} to="/console">管理面板</Link>
        </DropDownContent>
      </DropDown>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    display: 'flex',
    cursor: 'pointer'
  },

  title__content: {
    display: 'flex',
    position: 'relative',
    alignSelf: 'center',
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },

  triangle: {
    position: 'absolute',
    left: '50%',
    width: 0,
    height: 0,
    marginLeft: '-10px',
    marginTop: '-20px',
    border: '10px solid transparent',
    borderBottomColor: '#FFF'
  },

  link: {
    padding: '0 20px',
    height: '30px',
    color: '#665445',
    lineHeight: '30px',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: '#1077ff',
      color: '#FFF'
    }
  }
});

export default module.exports = Title;

