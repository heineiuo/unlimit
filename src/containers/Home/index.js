import React, {Component} from 'react'
import {Link} from 'react-router'

class Home extends Component {

  render (){
    return (
      <div className="container width-max" style={{paddingTop: 20}}>

        <div className="row">
          <div className="col-sm-6">

            <div className="paper" style={{marginBottom: 20}}>
              <a href="{{conf.hrefPrefix}}/host">域名管理</a>
            </div>

          </div>

          <div className="col-sm-6">

            <div className="paper" style={{marginBottom: 20}}>
              <a href="{{conf.hrefPrefix}}/file">文件管理</a>
            </div>
          </div>

          <div className="col-sm-6">

            <div className="paper" style={{marginBottom: 20}}>
              <a href="{{conf.hrefPrefix}}/process">进程管理</a>
            </div>
          </div>

          <div className="col-sm-6" style="margin-bottom: 20px;">

            <div className="paper">
              <a href="{{conf.hrefPrefix}}/cli">命令行工具</a>
            </div>
          </div>
        </div>



      </div>
    )
  }
  
}

export default Home