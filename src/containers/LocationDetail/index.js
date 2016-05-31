import React, {Component} from 'react'
import {Link} from 'react-router'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Paper from '../../components/Paper'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class Location extends Component {
  render (){

    const {currentHost} = this.props.hostState

    // <!--一个location的编辑状态-->
    return (

      <Paper>

        <div className="title">
          <h4><Link to={`/host/${currentHost._id}`}>{currentHost.hostname}</Link></h4>
        </div>

        <div className="clearfix">
          <div className="pull-left">
            <h5>编辑Location</h5>
          </div>

          <div style={{float: 'left', width: 100}}>
            <Button type="danger">删除这个location</Button>
          </div>
        </div>

        <div className="location-inner">

          <div className="form form-horizontal">

            <div className="active hide">
              <Input type="hidden" name="locationId" value={location._id} />
            </div>

            <div className="form-group row">
              <div className="col-xs-12">
                <label className="pull-left">/</label>
                <div className="pull-left active">
                  <Input type="hidden"
                         name="hostId"
                         value={location.hostId}
                  />
                  <Input className="form-control" name="pathname" id="pathnameInput" type="text" value="{location.pathname}" placeholder="请输入正则表达式" />
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
                          <Input type="checkbox" name="cors" checked={location.cors} />
                        )
                      } else {
                        return (
                          <Input type="checkbox" name="cors" />
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
                  <a to="#locationContentHTML" aria-controls="locationContentHTML" data-toggle="tab">
                    <Input type="radio" />HTML
                  </a>
                </li>
                <li className="{location.type=='api'?'active':''}">
                  <a to="#locationContentAPI" aria-controls="locationContentAPI" data-toggle="tab">
                    <Input type="radio" />API
                  </a>
                </li>
                <li className="{location.type=='json'?'active':''}">
                  <a to="#locationContentJSON" aria-controls="locationContentJSON" data-toggle="tab">
                    <Input type="radio" />JSON
                  </a>
                </li>
                <li className="{location.type=='redirect'?'active':''}">
                  <a to="#locationContentRedirect" aria-controls="locationContentRedirect" data-toggle="tab">
                    <Input
                      label="Redirect"
                      type="radio" />
                  </a>
                </li>
                <li className="{location.type=='proxy'?'active':''}">
                  <a to="#locationContentProxy" aria-controls="locationContentProxy" data-toggle="tab">
                    <Input type="radio" />Proxy
                  </a>
                </li>
                <li className="{location.type=='file'?'active':''}">
                  <a to="#locationContentFile" aria-controls="locationContentFile" data-toggle="tab">
                    <Input type="radio" />File
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div className="tab-pane {location.type=='html'?'active':''}" id="locationContentHTML">
                  <Input type="hidden" name="type" value="html" />
                    <label>HTML</label>
                    <div>
                      <label for="contentType">文本类型:</label>
                      <Input type="text" id="contentType" name="contentType" value="{location.contentType}" />
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
                  <Input type="hidden" name="type" value="api" />
                  <label>API url</label>
                  <div>
                    <Input type="text"/>
                  </div>
                </div>
                <div className="tab-pane {location.type=='json'?'active':''}" id="locationContentJSON">
                  <Input type="hidden" name="type" value="json" />
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
                  <Input type="hidden" name="type" value="redirect" />
                  <label>url</label>
                  <div>
                    <Input className="form-control" type="text" name="content"  value="{location.type=='redirect'?location.content:''}"/>
                  </div>
                </div>
                <div className="tab-pane {location.type=='proxy'?'active':''}" id="locationContentProxy">
                  <Input type="hidden" name="type" value="proxy"/>
                  <label>反向代理</label>
                  <div>
                    <Input className="form-control" type="text" name="content"  value="{location.type=='proxy'?location.content:''}"/>
                  </div>
                </div>
                <div className="tab-pane {location.type=='file'?'active':''}" id="locationContentFile">
                  <Input type="hidden" name="type" value="file"/>
                    <label>文件代理</label>
                    <div>
                      <Input className="form-control" type="text" name="content"  value="{location.type=='file'?location.content:''}"/>
                    </div>
                </div>
              </div>

            </div>


            <div className="form-group row">
              <div className="col-sm-offset-2 col-sm-4 form-error"></div>
            </div>

            <div className="form-group row">
              <div className="col-sm-4">
                <button className="btn btn-success btn-location-update">保存修改</button>
              </div>
            </div>

          </div>

        </div>

      </Paper>

    )
  }
}


function mapStateToProps(state) {
  return {
    hostState: state.host
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(HostActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location)