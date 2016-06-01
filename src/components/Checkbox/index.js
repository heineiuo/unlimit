import React, {Component} from 'react'
import MdCheckBoxOutlineBlank from 'react-icons/md/check-box-outline-blank'
import MdCheckBox from 'react-icons/md/check-box'
import classnames from 'classnames/bind'
import Style from './style.scss'

class Checkbox extends Component {
  state={}

  static defaultProps = {
    defaultChecked: false,
    onChange: ()=>{},
    label: '',
    style: {}
  }

  handleClick = (e) => {
    e.target.value=!this.props.checked
    this.props.onChange(e)
  }

  getCheckbox=()=>{
    return this.props.checked?
      <MdCheckBox className={Style.radio__icon} />
      : <MdCheckBoxOutlineBlank className={Style.radio__icon} />
  }
  render(){
    const {style, label, onChange} = this.props
    return (
      <div
        onClick={this.handleClick}
        style={style}
        className={Style.radio}
      >
        { this.getCheckbox() }
        <div className={Style.radio__label}>{label}</div>
      </div>
    )
  }
}

export default Checkbox