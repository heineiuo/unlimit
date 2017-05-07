import React, {Component} from 'react'
import IconBase from 'react-sea/lib/Icons/base'

const path = 'm11.6 16.6h16.8l-8.4 8.4z';


export default class Icon extends Component {
  render() {
    return (
      <IconBase viewBox="0 0 40 40" {...this.props}>
        <g>
          <path d={path} />
        </g>
      </IconBase>
    )
  }
}
