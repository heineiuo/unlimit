import React, {Component} from 'react'
import {Link} from 'react-router'

class Location extends Component {
  render (){

    return (

      <!--一个location的编辑状态-->
      <div className="container width-max" style="padding-top: 20px;">


        <div className="paper">

          <div className="title">
            <h4>
              <Link href={`${conf.hrefPrefix}/host/${host._id}`}>{host.hostname}</Link>
            </h4>
          </div>

          <div className="clearfix">
            <div className="pull-left">
              <h5>编辑Location</h5>
            </div>

            <div className="pull-right">
              <button className="btn btn-danger btn-sm" id="btnDeletelocation">删除这个location</button>
            </div>
          </div>

          <div className="location-inner">


            <div className="form form-horizontal">

              <div className="active hide">
                <input type="hidden" name="locationId" value={location._id} />
              </div>

              <div className="form-group row">
                <div className="col-xs-12">
                  <label className="pull-left">/</label>
                  <div className="pull-left active">
                    <input type="hidden" name="hostId" value={location.hostId} />
                    <input className="form-control" name="pathname" id="pathnameInput" type="text" value="{location.pathname}" placeholder="请输入正则表达式" />
                  </div>
                </div>
              </div>


              <div className="form-group row">
                <div className="col-xs-12">
                  <label className="pull-left">是否跨域</label>
                  <div className="pull-left active">
                    {
                      ()=>{
                        if ( location.cors == 'true') {
                          return (
                            <input type="checkbox" name="cors" checked={location.cors} />
                          )
                        } else {
                          return (
                            <input type="checkbox" name="cors" />
                          )
                        }
                      }
                    }
                  </div>
                </div>
              </div>


              <div className="form-group">
                <label>类型</label>

                <ul className="nav nav-tabs">
                  <li className="{location.type=='html'?'active':''}">
                    <a href="#locationContentHTML" aria-controls="locationContentHTML" data-toggle="tab">
                      <input type="radio" />HTML
                    </a>
                  </li>
                  <li className="{location.type=='api'?'active':''}">
                    <a href="#locationContentAPI" aria-controls="locationContentAPI" data-toggle="tab">
                      <input type="radio" />API
                    </a>
                  </li>
                  <li className="{location.type=='json'?'active':''}">
                    <a href="#locationContentJSON" aria-controls="locationContentJSON" data-toggle="tab">
                      <input type="radio" />JSON
                    </a>
                  </li>
                  <li className="{location.type=='redirect'?'active':''}">
                    <a href="#locationContentRedirect" aria-controls="locationContentRedirect" data-toggle="tab">
                      <input type="radio" />Redirect
                    </a>
                  </li>
                  <li className="{location.type=='proxy'?'active':''}">
                    <a href="#locationContentProxy" aria-controls="locationContentProxy" data-toggle="tab">
                      <input type="radio" />Proxy
                    </a>
                  </li>
                  <li className="{location.type=='file'?'active':''}">
                    <a href="#locationContentFile" aria-controls="locationContentFile" data-toggle="tab">
                      <input type="radio" />File
                    </a>
                  </li>
                </ul>

                <div className="tab-content">
                  <div className="tab-pane {location.type=='html'?'active':''}" id="locationContentHTML">
                    <input type="hidden" name="type" value="html" />
                      <label>HTML</label>
                      <div>
                        <label for="contentType">文本类型:</label>
                        <input type="text" id="contentType" name="contentType" value="{location.contentType}" />
                      </div>
                    <div>
                      <textarea
                        className="form-control"
                        name="content"
                        placeholder="直接输入HTML代码"
                        value={location.type=='html'?location.content:''}
                      />
                    </div>
                  </div>

                  <div className="tab-pane {location.type=='api'?'active':''}" id="locationContentAPI">
                    <input type="hidden" name="type" value="api" />
                    <label>API url</label>
                    <div>
                      <input type="text" className="form-control" name="content" value="{location.type=='api'?location.content:''}" />
                    </div>
                  </div>
                  <div className="tab-pane {location.type=='json'?'active':''}" id="locationContentJSON">
                    <input type="hidden" name="type" value="json" />
                    <label>json</label>
                    <div>
                      <textarea
                        className="form-control"
                        name="content"
                        placeholder="直接输入JSON代码"
                      >{location.type=='json'?location.content:''}</textarea>
                    </div>
                  </div>

                  <div className="tab-pane {location.type=='redirect'?'active':''}" id="locationContentRedirect">
                    <input type="hidden" name="type" value="redirect" />
                      <label>url</label>
                      <div>
                        <input className="form-control" type="text" name="content"  value="{location.type=='redirect'?location.content:''}"/>
                      </div>
                  </div>
                  <div className="tab-pane {location.type=='proxy'?'active':''}" id="locationContentProxy">
                    <input type="hidden" name="type" value="proxy"/>
                      <label>反向代理</label>
                      <div>
                        <input className="form-control" type="text" name="content"  value="{location.type=='proxy'?location.content:''}"/>
                      </div>
                  </div>
                  <div className="tab-pane {location.type=='file'?'active':''}" id="locationContentFile">
                    <input type="hidden" name="type" value="file"/>
                      <label>文件代理</label>
                      <div>
                        <input className="form-control" type="text" name="content"  value="{location.type=='file'?location.content:''}"/>
                      </div>
                  </div>
                </div>

              </div>


              <div className="form-group row">
                <div className="col-sm-offset-2 col-sm-4 form-error"></div>
              </div>

              <div className="form-group row" style="border-top: 1px solid #eee;">
                <div className="col-sm-4">
                  <button className="btn btn-success btn-location-update">保存修改</button>
                </div>
              </div>

            </div>
            <!-- end form-->



          </div>


        </div>

      </div>

    )
  }
}

export default Location