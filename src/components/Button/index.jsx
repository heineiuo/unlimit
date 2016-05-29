import React, {Component} from 'react'

import style from './style.scss'

class Button extends Component {

  state = {}

  static defaultProps = {
  }

  static propTypes = {
  }

  static contextTypes = {
  }

  render (){
    const {children} = this.props
    return (
      <div {...this.props} className={style.inputWrapper}>
        {children}
      </div>
    )
  }

}

export default Button
