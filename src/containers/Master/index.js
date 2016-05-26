import React, {Component} from 'react'
import {Link} from 'react-router'


class Master extends Component {

  render(){
    return (
      <div>
        <div className="sidebar hide"></div>
        <div className="sidebar-next" id="page-container"></div>
      </div>
    )
  }
}

export default Master