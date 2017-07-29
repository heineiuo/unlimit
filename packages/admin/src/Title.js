import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'

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
        Smile
        <div style={{color}}>{title}</div>
      </div>
    )
  }
}

export default module.exports = Title;

