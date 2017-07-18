import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import {Logo} from 'react-sea/lib/Smile'


class Title extends Component {

  static defaultProps = {
    color: '#666',
    style: {},
    title: "右括号"
  };

  render (){
    const {title, color, style} = this.props;
    return (
      <div style={Object.assign({display: 'flex'}, style)}>
        <Logo />
        <div style={{color}}>{title}</div>
      </div>
    )
  }
}

export default module.exports = Title;

