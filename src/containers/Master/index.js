import React, {Component} from 'react'
import {Link} from 'react-router'
import NavBar from '../../components/NavBar'

import Style from './style.scss'


class Master extends Component {

  render(){
    return (
      <div className={Style.container}>
        <NavBar />
        <div className={Style.sidebar} >
          <ul className="nav nav-list">
            <li className="">
              <Link  to="/" className="menu-text link">控制台</Link>
            </li>
          </ul>
        </div>
        <div className={Style.sidebar__next}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Master