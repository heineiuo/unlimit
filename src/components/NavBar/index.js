import React, {Component} from 'react'

class NavBar extends Component {

  render () {

    return  (
      <nav className={cx("navbar","navbar-inverse", "reset-radius", "header")}>
        <div className="container width-max">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className={cx("icon-bar")}></span>
              <span className={cx("icon-bar")}></span>
              <span className={cx("icon-bar")}></span>
            </button>
            <a className="navbar-brand" href="{{conf.hrefPrefix}}/">多功能HTTP服务器</a>
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