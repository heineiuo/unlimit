import React, {Component} from 'react'
import Style from './style.scss'

class Card extends Component {
  render(){
    return (
      <div className={Style.card}>
        {this.props.children}
      </div>
    )
  }
}

export default Card