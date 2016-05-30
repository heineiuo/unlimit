import React, {Component} from 'react'
import Style from './style.scss'

class Paper extends Component {
  render(){
    return (
      <div className={Style.paper} {...this.props}>
        {this.props.children}
      </div>
    )
  }
}

export default Paper