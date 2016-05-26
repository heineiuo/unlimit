import React, {Component} from 'react'
import {Link} from 'react-router'

class HostDetail extends Component {
  render(){
    return (
      <div className="container width-max" style="padding-top: 20px;">

        <div className="paper">

          <div className="title clearfix">
            <div className="h4">
              <a href="{conf.hrefPrefix}/host/{host._id}">{host.hostname}</a>
              <small className="pull-right">
                <a href="#" className="btn btn-xs btn-danger" id="deleteHost">删除</a>
              </small>
            </div>
          </div>

          <div className="h5">
            location列表
            <small>
              <a href="{conf.hrefPrefix}/host/{host._id}/location/new" className="btn btn-xs btn-primary">新建</a>
            </small>
          </div>

          <div className="location-list">
            <table className="table table-hoverd">

              <thead>
              <tr>
                <th>pathname</th>
                <th>优先级</th>
                <th>类型</th>
                <th>操作</th>
              </tr>
              </thead>

              <tbody>

              { () => {
                  _.map(list, function(item, index){
                    return (
                      <tr data-hostId="{item.hostId}" data-locationId="{item._id}">
                        <td><code>{item.pathname}</code></td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-default btn-xs" data-updatesort="up" data-sort="{item.sort}">
                              <i className="glyphicon glyphicon-menu-up"></i>
                            </button>
                            <button className="btn btn-default btn-xs">{item.sort}</button>
                            <button className="btn btn-default btn-xs" data-updatesort="down" data-sort="{item.sort}">
                              <i className="glyphicon glyphicon-menu-down"></i>
                            </button>
                          </div>
                        </td>
                        <td><code>{item.type}</code></td>
                        <td>
                          <div className="btn-group">
                            <a href="{conf.hrefPrefix}/host/{host._id}/location/{item._id}" className="btn btn-xs  btn-primary">详情</a>
                          </div>
                        </td>
                      </tr>


                    )
                  })
                }
              }


              </tbody>

            </table>
          </div>

        </div>


      </div>

    )
  }
}

export default HostDetail