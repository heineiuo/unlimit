import React, {Component} from 'react'
import {Link} from 'react-router'
import classnames from 'classnames/bind'
import Style from './style.scss'

const cx = classnames.bind(Style)

const style = {
  navbar__brand: {
    paddingLeft: 20,
    color: 'rgb(0, 216, 255)',
    fontWeight: 'bold',
    height: '50px',
    lineHeight: '50px'
  }
}

class NavBar extends Component {

  render () {

    return  (
      <nav className={cx("navbar","navbar-inverse", "reset-radius", "header")}>
        <div className="container width-max">
          <div className={cx("navbar-header")}>
            <Link style={style.navbar__brand}
                  to="/">右括号云平台</Link>
          </div>
          <div className={cx("collapse", "navbar-collapse")}>
            <ul className={cx("nav","navbar-nav","navbar-right")}>

            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar