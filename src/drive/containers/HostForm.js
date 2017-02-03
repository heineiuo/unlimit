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
import {editLocationSort, getHostLocationList} from '../store/host'
import {setTitle} from '../store/nav'

class HostForm extends Component {

  componentWillMount = () => {
    const {getHostLocationList, setTitle, params} = this.props;
    setTitle('路由列表');
    getHostLocationList(params.hostname)
  };

  render () {
    const {hostname} = this.props.params;
    const {editLocationSort} = this.props;
    const {loadingLocationList, locationList, host} = this.props.hostState;
    return (
      <Paper>
        <div className={css(styles.titlebar, styles.clearfix)}>
          <Link to={`/${host.hostname}/location`} style={{float: 'left'}}>{host.hostname}</Link>
          <a href={`http://${host.hostname}`} target="_blank">打开</a>
        </div>
        <div className={css(styles.titlebar, styles.clearfix)}>
          <div style={{float: 'left'}}>路由列表</div>
          <Link to={`/${host.hostname}/location/new`}  style={{float: 'left'}}>
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
                              to={`/${host.hostname}/location/pathname?pathname=${location.pathname}`}
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



export default module.exports = connect(
  (state) => ({
    hostState: state.host
  }),
  (dispatch) => bindActionCreators({
    editLocationSort,
    setTitle,
    getHostLocationList

  }, dispatch)
)(HostForm)