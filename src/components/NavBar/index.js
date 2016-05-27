import React, {Component} from 'react'
import {Link} from 'react-router'
import classnames from 'classnames/bind'
import Style from './style.scss'

const cx = classnames.bind(Style)

class NavBar extends Component {

  render () {

    return  (
      <nav className={cx("navbar","navbar-inverse", "reset-radius", "header")}>
        <div className="container width-max">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">右括号云平台</Link>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right" id="userbar"></ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar