import React, {Component} from 'react'
import classnames from 'classnames/bind'

import style from './style.scss'
const cx = classnames.bind(style)

class Input extends Component {

  state = {

  }

  static defaultProps = {
    label: '',
    type: 'text'
  }

  static propTypes = {
    onChange: React.PropTypes.func,
    type: React.PropTypes.string,
    label: React.PropTypes.string
  }

  static contextTypes = {
  }

  render (){


    const {inlineGroup=false, noBorder=flase} = this.props

    return (
      <div {...this.props} className={cx('inputWrapper', {
        inlineGroup: inlineGroup
      })}>
        <label>{this.props.label}</label>
        <div className={cx("wrap", {})}>
          <input className={cx('input', {
            'input--no-border': noBorder
          })}
            {...this.props}
          />
        </div>
      </div>
    )
  }
}

export default Input
