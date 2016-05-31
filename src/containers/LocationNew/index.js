import React, {Component} from 'react'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

import Tabbar, {TabPane} from '../../components/Tabbar'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Paper from '../../components/Paper'

import classnames from 'classnames/bind'
import Style from './style.scss'

const cx = classnames.bind(Style)

class Location extends Component {

  state = {
    activeKey: 'API'
  }

  saveLocation=()=>{
    console.log('saving location...')
    const editLocation = this.props
    editLocation(this.state.location)
  }

  renderTabber=()=>{
    const that = this
    const bodyType = [
      'HTML',
      'JSON',
      'API',
      'PROXY',
      'REDIRECT',
      'FILE'
    ]

    const panes = bodyType.map((type, index)=>{
      return (
        <TabPane key={type}
                 onClick={()=>{that.setState({activeKey: type})}}>
          {bodyType[index]}
        </TabPane>
      )
    })

    return (
      <Tabbar activeKey={this.state.activeKey}
              onSwitchKey={(key)=>{
                console.log(key)
                this.setState({activeKey: key})
              }}
      >
        {panes}
      </Tabbar>
    )
  }

  renderTabContent=()=>{
    const {activeKey} = this.state

    if (activeKey == 'HTML') {
        return (
          <div className="tab-pane active" id="locationContentHTML">
            <label>HTML</label>
            <div>
              <select name="contentType">
                <option value="text">text</option>
                <option value="file">file</option>
              </select>
            </div>
            <div>
              <textarea
                className="form-control"
                name="content"
                placeholder="直接输入HTML代码"
              />
            </div>
          </div>

        )
    }

    if (activeKey=='API'){
      return (
        <div className="tab-pane" id="locationContentAPI">
          <div>
            <Input
              label="API url"
              type="text"
              name="content"
            />
          </div>
        </div>
      )
    }

    if (activeKey=='JSON') {
      return <div className="tab-pane" id="locationContentJSON">
        <label>json</label>
        <div>
          <textarea
            className="form-control"
            name="content"
            placeholder="直接输入JSON代码"
          />
        </div>
      </div>
    }

    if (activeKey =='REDIRECT') {
      return (
        <div className="tab-pane" id="locationContentRedirect">
          <div>
            <Input
              label="url"
              type="text"
              name="content"
            />
          </div>
        </div>
      )
    }

    if (activeKey=='PROXY') {
      return (
        <div className="tab-pane" id="locationContentProxy">
          <div>
            <Input
              label="反向代理"
              type="text"
              name="content"
            />
          </div>
        </div>
      )
    }

    if (activeKey =='FILE') {
      return (
        <div className="tab-pane" id="locationContentFile">
          <div>
            <Input
              label="文件代理"
              type="text"
              name="content"
              placeholder="请输入服务器真实路径"
            />
          </div>
        </div>
      )
    }


  }

  render (){

    const {currentHost} = this.props.hostState

    return (
      <Paper>
        <div className={cx("title")}>
          <h4>
            <Link to={`/host/${currentHost._id}`}>{currentHost.hostname}</Link>
          </h4>
        </div>

        <h5>添加一个Page</h5>

        <div className="location-wrap">
          <div className="form">
            <div className="form-group row">
              <div className="col-xs-12">
                <Input
                  label={'/'}
                  noBorder={true}
                  inlineGroup={true}
                  name="pathname"
                  id="pathnameInput"
                  type="text"
                  placeholder="请输入正则表达式"
                />
              </div>

              <div className="form-group row">
                <div className="col-xs-12">
                  <div className="pull-left active">
                    <Input type="checkbox"
                           label="是否跨域"
                           name="cors" />
                  </div>
                </div>
              </div>

              <div
                className="form-group">
                <label>类型</label>

                <div style={{width: '100%', height: 50, position: 'relative'}}

                >
                  {this.renderTabber()}
                </div>

                <div className="tab-content">
                  {this.renderTabContent()}
                </div>

              </div>


              <div className="form-group row">
                <div className="col-sm-offset-2 col-sm-4 form-error"></div>
              </div>

              <div className="form-group row">
                <div className="col-sm-4">
                  <Button type="primary"
                          onClick={this.saveLocation}>提交</Button>
                </div>
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