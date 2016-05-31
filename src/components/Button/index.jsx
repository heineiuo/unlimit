import React, {Component} from 'react'
import classnames from 'classnames/bind'
import style from './style.scss'

const cx = classnames.bind(style)

class Button extends Component {

  static defaultProps = {
    type: 'primary'
  }

  render (){
    const {children, type} = this.props
    return (
      <div {...this.props} className={cx(`btn--${type}`)}>
        {children}
      </div>
    )
  }

}

export default Button
