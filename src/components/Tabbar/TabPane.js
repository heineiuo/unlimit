import React, {Component} from 'react'
import style from './style.scss'

class TabPane extends Component {
  state = {
  }

  render (){

    const {width, children} = this.props

    return (
      <div
        className={style.tabpane}
        style={{width: width}}
        onClick={this.props.onClick}
      >
        {children}
      </div>
    )
  }
}

export default TabPane