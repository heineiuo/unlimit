import React, {Component} from 'react'
import classnames from 'classnames/bind'
import style from './style.scss'

const cx = classnames.bind(style)

class Button extends Component {

  static defaultProps = {
    type: 'primary',
    size: 'large'
  }

  render (){
    const {children, type, size} = this.props
    return (
      <div {...this.props} className={cx(`btn--${type}`, `btn--size--${size}`)}>
        {children}
      </div>
    )
  }

}

export default Button
