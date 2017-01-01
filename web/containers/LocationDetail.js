import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {TabBar, TabPane} from 'react-components/Tabbar'
import Input from 'react-components/Input'
import Button from 'react-components/Button'
import Paper from 'react-components/Paper'
import Radio from 'react-components/Radio'
import Checkbox from 'react-components/Checkbox'
import {StyleSheet, css} from 'aphrodite';
import * as API from 'youkuohao-sdk/gateway'

class LocationDetail extends Component {

  state = {
    type: 'HTML',
    pathname: '',
  };

  saveLocation = () => {
    const {hostname} = this.props.params;
    const {editLocation, createLocation} = this.props;
    const {pathname} = this.props.location.query;
    pathname ? editLocation(hostname, this.state) : createLocation(hostname, this.state)
  };

  componentWillMount = () => {
    const {hostname} = this.props.params;
    const {pathname} = this.props.location.query;
    this.props.getRouterDetail(hostname, pathname, (location) => this.setState(location))
  };

  // componentWillReceiveProps = (nextProps) => {
  //   this.setState(nextProps.host.location)
  // };

  render() {
    const {params, location} = this.props;
    const {hostname} = params;
    const {pathname} = location.query;
    const type = this.state.type.toUpperCase() || 'HTML';
    const checkType = (contentType) => this.setState({contentType});
    const bodyType = ['HTML', 'JSON', 'API', 'PROXY', 'SEASHELL', 'REDIRECT', 'FILE'];

    return (
      <Paper>
        <div>
          <Link to={`/host/${hostname}/location`}>{hostname}</Link>
        </div>
        <h5>{pathname?'编辑':'新增'}</h5>
        <div className="locationWrap">
          <div className="form">
            <div className="formGroup row">
              <div className="col-xs-12">
                <Input
                  label={'路由地址'}
                  noBorder={true}
                  inlineGroup={true}
                  value={this.state.pathname}
                  onChange={(e) => {this.setState({pathname: e.target.value})}}
                  type="text"
                  placeholder="请输入正则表达式"/>
              </div>
              <div className="form-group row">
                <div className="col-xs-12">
                  <Checkbox
                    label="是否跨域"
                    checked={this.state.cors}
                    onChange={(e)=>{this.setState({cors: e.target.value})}}/>
                </div>
              </div>
              <div className="form-group">
                <label>类型</label>
                <div style={{width: '100%', height: 50, position: 'relative'}}>
                  <TabBar
                    activeKey={this.state.type.toUpperCase()}
                    onSwitchKey={(key) => this.setState({type: key})}>
                    {
                      bodyType.map((type, index) => (
                        <TabPane
                          key={type}
                          onClick={()=>{this.setState({type: type})}}>{type}</TabPane>
                      ))
                    }
                  </TabBar>
                </div>
                <div className="tab-content">
                  {
                    {
                      HTML: (
                        <div className="tab-pane active">
                          <label>HTML</label>
                          <div>
                            <Radio
                              label="text"
                              checked={this.state.contentType=='text'}
                              onClick={()=>{checkType('text')}}/>
                            <Radio
                              label="file"
                              checked={this.state.contentType=='file'}
                              onClick={()=>{checkType('file')}}/>
                          </div>
                          <div>
                            <textarea
                              className="form-control"
                              name="content"
                              value={this.state.content}
                              onChange={(e) => {this.setState({content: e.target.value})}}
                              placeholder="直接输入HTML代码"/>
                          </div>
                        </div>
                      ),

                      API: (
                        <div className="tab-pane">
                          <div>
                            <Input
                              label="API url"
                              type="text"
                              onChange={(e)=>{this.setState({content: e.target.value})}}
                              value={this.state.content}
                              name="content"/>
                          </div>
                        </div>
                      ),

                      SEASHELL: (
                        <div>
                          <div>
                            <Input
                              label="SEASHELL"
                              type="text"
                              onChange={(e)=>{this.setState({content: e.target.value})}}
                              value={this.state.content}
                              name="content"/>
                          </div>
                        </div>
                      ),

                      JSON : (
                        <div className="tab-pane">
                          <label>json</label>
                          <div>
                            <textarea
                              className="form-control"
                              name="content"
                              onChange={(e)=>{this.setState({content: e.target.value})}}
                              value={this.state.content}
                              placeholder="直接输入JSON代码"/>
                          </div>
                        </div>
                      ),

                      REDIRECT:(
                        <div className="tab-pane" id="locationContentRedirect">
                          <div>
                            <Input
                              label="url"
                              type="text"
                              onChange={(e)=>{this.setState({content: e.target.value})}}
                              value={this.state.content}
                              name="content"/>
                          </div>
                        </div>
                      ),

                      PROXY:(
                        <div className="tab-pane" id="locationContentProxy">
                          <div>
                            <Input
                              label="反向代理"
                              type="text"
                              onChange={(e) => {this.setState({content: e.target.value})}}
                              value={this.state.content}
                              name="content"/>
                          </div>
                        </div>
                      ),

                      FILE: (
                        <div className="tab-pane" id="locationContentFile">
                          <div>
                            <Input
                              label="文件代理"
                              type="text"
                              onChange={(e) => {this.setState({content: e.target.value})}}
                              name="content"
                              value={this.state.content}
                              placeholder="请输入服务器真实路径"/>
                          </div>
                        </div>
                      )
                    }[type]
                  }
                </div>
              </div>
              <div>
                <div className="col-sm-offset-2 col-sm-4 form-error"></div>
              </div>
              <div className="form-group row">
                <div className="col-sm-4">
                  <Button
                    type="primary"
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto',
    boxShadow: '0 2px 5px #CCC',
  }
});


export default module.exports = connect(
  (state) => ({
    host: state.host
  }), (dispatch) => bindActionCreators({

    /**
     * 编辑路由
     * @param hostname
     * @param nextLocation
     * @returns {function()}
     */
    editLocation: (hostname, nextLocation) => async(dispatch, getState) => {
      try {
        const {token} = getState().account;
        const {pathname, cors, type, contentType='text', content} = nextLocation;
        const response = await API.LocationEdit({
          token, hostname, pathname, cors,
          type, contentType, content
        });

        if (response.error) throw new Error(response.error);
        dispatch({
          type: 'UPDATE_LOCATION',
          nextLocation: nextLocation
        })
      } catch(e){
        console.log(e)
      }
    },

    /**
     * 新建路由
     * @param hostname
     * @param nextLocation
     * @returns {function()}
     */
    createLocation: (hostname, nextLocation) => async(dispatch, getState) => {
      try {
        const {token} = getState().account;
        const {pathname, cors, type, contentType, content} = nextLocation;
        const response = await API.LocationNew({token, hostname, pathname, cors, type, contentType, content});
        if (response.error) throw new Error(response.error);
        dispatch({
          type: 'UPDATE_LOCATION',
          nextLocation: nextLocation
        })
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * 获取路由配置详情
     */
    getRouterDetail: (hostname, pathname, callback) => async (dispatch, getState) => {
      try {
        const {token} = getState().account;
        const data = await API.LocationList({hostname, token});
        dispatch({
          type: 'UPDATE_LOCATION_DETAIL',
          hostname: data.host.hostname,
          location: data.location.locations[pathname]
        });
        callback(data.location.locations[pathname])
      } catch(e){
        console.log(e)
      }
    }
  }, dispatch)
)(LocationDetail)