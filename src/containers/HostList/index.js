import React, {Component} from 'react'
import {Link} from 'react-router'

class HostList extends Component {
  render(){

    return (
      <div className="container width-max" style="padding-top: 20px;">
        <div className="paper">
          <div className="title">
            <h4 className="">
              域名列表
              <small style="margin-left: 20px;">
                <a href="{{conf.hrefPrefix}}/host/new" className="btn btn-xs btn-primary">添加</a>
              </small>
            </h4>
          </div>
          <div className="host-list">

            <table className="table">
              <thead>
              <tr>
                <th>hostname</th>
                <th>操作</th>
              </tr>
              </thead>

              <tbody>

              {()=>{
                list.forEach(item, index=>{
                  return (
                    <tr key={index}>
                      <td><code>{item.hostname}</code></td>
                      <td>
                        <div className="btn-group">
                          <a href="{{conf.hrefPrefix}}/host/{{item._id}}" className="btn btn-xs  btn-primary">详情</a>
                        </div>
                      </td>
                    </tr>
                  )
                })

              }}
              </tbody>

            </table>

          </div>
        </div>
      </div>
    )

  }
}

export default HostList