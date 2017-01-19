import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import Paper from 'react-sea/lib/Paper'
import Button from 'react-sea/lib/Button'
import Input from 'react-sea/lib/Input'
import MdArrowUpward from 'react-sea/lib/Icons/arrow-upward'
import MdArrowDownward from 'react-sea/lib/Icons/arrow-downward'
import { StyleSheet, css } from 'aphrodite'
import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../constants'

class HostForm extends Component {

  componentWillMount = () => {
    const {actions, params} = this.props;
    actions.getHostLocationList(params.hostname)
  };

  render () {
    const {hostname} = this.props.params;
    const {editLocationSort} = this.props.actions;
    const {loadingLocationList, locationList, host} = this.props.hostState;
    return (
      <Paper>
        <div className={css(styles.titlebar, styles.clearfix)}>
          <Link to={`/host/${host.hostname}/location`} style={{float: 'left'}}>{host.hostname}</Link>
          <a href={`http://${host.hostname}`} target="_blank">打开</a>
        </div>
        <div className={css(styles.titlebar, styles.clearfix)}>
          <div style={{float: 'left'}}>路由列表</div>
          <Link to={`/host/${host.hostname}/location/new`}  style={{float: 'left'}}>
            <Button type="primary" size="small">新建</Button>
          </Link>
        </div>
        <div className={css(styles.locationList)}>
          { (() => {
            if (loadingLocationList) return <div>正在加载</div>
            if (locationList.length==0) return <div>路由列表为空</div>
            return (
              <table className="table table-hoverd">
                <thead>
                <tr>
                  <th>路由</th>
                  <th>优先级</th>
                  <th>类型</th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {(() => {
                  return Object.values(locationList).sort((a,b) => a.sort - b.sort).map((location, index)=>{
                    return (
                      <tr key={location.pathname}>
                        <td><code>{location.pathname}</code></td>
                        <td>
                          <div className="btn-group">
                            <button
                              disabled={location.sort==1}
                              className="btn btn-default btn-xs"
                              onClick={() => location.sort!=1 & editLocationSort(hostname, location, 'up')}>
                              <MdArrowUpward />
                            </button>
                            <button className="btn btn-default btn-xs">{location.sort}</button>
                            <button
                              disabled={location.sort==Object.values(locationList).length}
                              className="btn btn-default btn-xs"
                              onClick={() => location.sort!=Object.values(locationList).length & editLocationSort(hostname, location, 'down')}>
                              <MdArrowDownward />
                            </button>
                          </div>
                        </td>
                        <td><code>{location.type}</code></td>
                        <td>
                          <div className="btn-group">
                            <Link
                              to={`/host/${host.hostname}/location/pathname?pathname=${location.pathname}`}
                              className="btn btn-xs  btn-primary">详情</Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                })()}
                </tbody>
              </table>
            )
          })()}
        </div>
      </Paper>
    )
  }
}

const styles = StyleSheet.create({
  titlebar: {
    marginBottom: 20,
  },

  clearfix: {
    ':after': {
      clear: 'both',
      fontSize: 0,
      height: 0,
      content: '""',
      display: 'table'
    }
  }

});



export default module.exports = connect((state) => {
  return {
    hostState: state.host
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({
      /**
       * 排序,设置优先级
       * @returns {function()}
       */
      editLocationSort: (hostname, location, arrow) => async(dispatch, getState) => {
        try {
          const {token} = getState().account;
          const {sort, pathname} = location;
          const nextSort = sort + (arrow=='up'?-1:1);
          if (nextSort < 1) return false;
          const response = await POSTRawJSON(`${API_HOST}/location/updatesort`,{token, hostname, pathname, nextSort});
          if (response.error) throw response.error;
          const data = await POSTRawJSON(`${API_HOST}/location/list`, {token, hostname});
          if (data.error) throw data.error;
          console.log(data.location.locations);
          dispatch({
            type: "UPDATE_LOCATION_LIST",
            host: data.host,
            hostname: hostname,
            locationList: data.location.locations
          })
        } catch(e){
          console.log(e);
          alert(e)
        }
      },

      /**
       * 获取location列表
       * @returns {function()}
       */
      getHostLocationList: (hostname) => async (dispatch, getState)=>{
        try {
          const {token} = getState().account;
          const data = await POSTRawJSON(`${API_HOST}/location/list`, {hostname, token});
          if (data.error) throw data.error;
          dispatch({
            type: "UPDATE_LOCATION_LIST",
            host: data.host,
            hostname: hostname,
            locationList: data.location.locations
          })
        } catch(e) {
          console.log(e)
        }
      }

    }, dispatch)
  }
})(HostForm)