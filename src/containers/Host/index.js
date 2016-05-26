import React, {Component} from 'react'

class Host extends Component {
  render(){
    return (
      <div class="container width-max" style="padding-top: 20px;">

        <div class="paper">

          <div class="title clearfix">
            <div class="h4">
              <a href="{conf.hrefPrefix}/host/{host._id}">{host.hostname}</a>
              <small class="pull-right">
                <a href="#" class="btn btn-xs btn-danger" id="deleteHost">删除</a>
              </small>
            </div>
          </div>

          <div class="h5">
            location列表
            <small>
              <a href="{conf.hrefPrefix}/host/{host._id}/location/new" class="btn btn-xs btn-primary">新建</a>
            </small>
          </div>

          <div class="location-list">
            <table class="table table-hoverd">

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
                          <div class="btn-group">
                            <button class="btn btn-default btn-xs" data-updatesort="up" data-sort="{item.sort}">
                              <i class="glyphicon glyphicon-menu-up"></i>
                            </button>
                            <button class="btn btn-default btn-xs">{item.sort}</button>
                            <button class="btn btn-default btn-xs" data-updatesort="down" data-sort="{item.sort}">
                              <i class="glyphicon glyphicon-menu-down"></i>
                            </button>
                          </div>
                        </td>
                        <td><code>{item.type}</code></td>
                        <td>
                          <div class="btn-group">
                            <a href="{conf.hrefPrefix}/host/{host._id}/location/{item._id}" class="btn btn-xs  btn-primary">详情</a>
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