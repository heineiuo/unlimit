import React, {Component} from 'react'
import {Link} from 'react-router'
import NavBar from '../../components/NavBar'

class Master extends Component {

  render(){
    return (
      <div style={{paddingTop: 50}}>
        <NavBar />
        <div className="sidebar hide"></div>
        <div className="sidebar-next">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Master