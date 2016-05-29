import React, {Component} from 'react'
import {Link} from 'react-router'

class Home extends Component {

  render (){
    return (
      <div className="container width-max" style={{paddingTop: 20}}>

        <div className="row">
          <div className="col-sm-6">

            <div className="paper" style={{marginBottom: 20}}>
              <Link to={'/host'}>域名管理</Link>
            </div>

          </div>

          {/*

           <div className="col-sm-6">

            <div className="paper" style={{marginBottom: 20}}>
              <Link to="/file">文件管理</Link>
            </div>
          </div>


          <div className="col-sm-6">

            <div className="paper" style={{marginBottom: 20}}>
              <Link to="/process">进程管理</Link>
            </div>
          </div>

          <div className="col-sm-6" style={{marginBottom: 20}}>

            <div className="paper">
              <Link to="/cli">命令行工具</Link>
            </div>
          </div>

           */}

        </div>



      </div>
    )
  }
  
}

export default Home