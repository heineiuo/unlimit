import React, {Component} from 'react'
import MdRadioButtonUnchecked from 'react-icons/md/radio-button-unchecked'
import MdRadioButtonChecked from 'react-icons/md/radio-button-checked'
import classnames from 'classnames/bind'
import Style from './style.scss'

class Radio extends Component {

  static defaultProps = {
    checked: false,
    onClick: ()=>{},
    label: '',
    style: {}
  }

  getRadio=()=>{
    return this.props.checked?
      <MdRadioButtonChecked className={Style.radio__icon} />
      : <MdRadioButtonUnchecked className={Style.radio__icon} />
  }
  render(){
    const {style, label, onClick} = this.props
    return (
      <div
        onClick={onClick}
        style={style}
        className={Style.radio}
      >
        { this.getRadio() }
        <div className={Style.radio__label}>{label}</div>
      </div>
    )
  }
}

export default Radio