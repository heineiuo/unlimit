import React, {Component} from 'react'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

import Tabbar, {TabPane} from '../../components/Tabbar'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Paper from '../../components/Paper'
import Radio from '../../components/Radio'
import Checkbox from '../../components/Checkbox'

import classnames from 'classnames/bind'
import Style from './style.scss'

const cx = classnames.bind(Style)

class Location extends Component {

  state = {
    type: 'HTML',
    pathname: '',
  }

  saveLocation=()=>{
    console.log('saving location...')
    const {editLocation} = this.props.hostActions
    editLocation(this.state)
  }

  componentWillMount = ()=>{
    console.log(`location_id: ${this.props.params.location_id}`)
    if(this.props.params.location_id) {
      const {getRouterDetail} = this.props.hostActions
      getRouterDetail(this.props.params.host_id, this.props.params.location_id)
    }
  }

  componentWillReceiveProps =(nextProps)=>{
    this.setState(nextProps.hostState.location)
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
                 onClick={()=>{that.setState({type: type})}}
        >{bodyType[index]}</TabPane>
      )
    })

    return (
      <Tabbar activeKey={that.state.type.toUpperCase()}
              onSwitchKey={(key)=>{
                this.setState({type: key})
              }}
      >
        {panes}
      </Tabbar>
    )
  }

  renderTabContent=()=>{

    const that = this
    let {type} = this.state
    type = type.toUpperCase()

    if (type == 'HTML') {

      const checkType = (contentType) =>{
        that.setState({contentType: contentType})
      }
      return (
        <div className="tab-pane active" id="locationContentHTML">
          <label>HTML</label>
          <div>
            <Radio label="text"
                   checked={this.state.contentType=='text'}
                   onClick={()=>{checkType('text')}}/>
            <Radio label="file"
                   checked={this.state.contentType=='file'}
                   onClick={()=>{checkType('file')}}/>
          </div>
          <div>
            <textarea
              className="form-control"
              name="content"
              value={this.state.content}
              onChange={(e)=>{this.setState({content: e.target.value})}}
              placeholder="直接输入HTML代码"
            />
          </div>
        </div>

      )
    }

    if (type=='API'){
      return (
        <div className="tab-pane" id="locationContentAPI">
          <div>
            <Input
              label="API url"
              type="text"
              onChange={(e)=>{this.setState({content: e.target.value})}}
              value={this.state.content}
              name="content"
            />
          </div>
        </div>
      )
    }

    if (type=='JSON') {
      return <div className="tab-pane" id="locationContentJSON">
        <label>json</label>
        <div>
          <textarea
            className="form-control"
            name="content"
            onChange={(e)=>{this.setState({content: e.target.value})}}
            value={this.state.content}
            placeholder="直接输入JSON代码"
          />
        </div>
      </div>
    }

    if (type =='REDIRECT') {
      return (
        <div className="tab-pane" id="locationContentRedirect">
          <div>
            <Input
              label="url"
              type="text"
              onChange={(e)=>{}}
              value={this.state.content}
              name="content"
            />
          </div>
        </div>
      )
    }

    if (type=='PROXY') {
      return (
        <div className="tab-pane" id="locationContentProxy">
          <div>
            <Input
              label="反向代理"
              type="text"
              onChange={(e)=>{}}
              value={this.state.content}
              name="content"
            />
          </div>
        </div>
      )
    }

    if (type =='FILE') {
      return (
        <div className="tab-pane" id="locationContentFile">
          <div>
            <Input
              label="文件代理"
              type="text"
              onChange={(e)=>{}}
              name="content"
              value={this.state.content}
              placeholder="请输入服务器真实路径"
            />
          </div>
        </div>
      )
    }


  }


  render (){

    const that = this
    const {host} = this.props.hostState

    return (
      <Paper>
        <div className={cx("title")}>
          <Link to={`/host/${host._id}`}>{host.hostname}</Link>
        </div>

        <h5>添加一个路由</h5>

        <div className="location-wrap">
          <div className="form">
            <div className="form-group row">
              <div className="col-xs-12">
                <Input
                  label={'路由地址'}
                  noBorder={true}
                  inlineGroup={true}
                  value={that.state.pathname}
                  onChange={(e)=>{that.setState({pathname: e.target.value})}}
                  type="text"
                  placeholder="请输入正则表达式"
                />
              </div>

              <div className="form-group row">
                <div className="col-xs-12">
                  <Checkbox
                    label="是否跨域"
                    checked={this.state.cors}
                    onChange={(e)=>{this.setState({cors: e.target.value})}}
                  />
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