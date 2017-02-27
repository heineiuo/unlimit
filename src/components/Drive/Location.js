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
import Spin from 'react-spin'

class Location extends Component {

  componentWillMount = () => {
    const {getLocation, setTitle, params, host} = this.props;
    getLocation(host.hostname);
    setTitle(`${host.hostname} - 路由列表`);
  };

  componentWillReceiveProps = (nextProps) => {
    const {getLocation, setTitle, params, host} = this.props;
    if (nextProps.host.locationState == 0) getLocation(host.hostname)
  };

  render () {
    const {editLocationSort, host} = this.props;
    const {hostname} = host;
    return (
      <div style={{padding: '20px 0', margin: '0 auto', maxWidth: 1000}}>
        {
          host.locationState < 2?
            <Spin />:
            <div>
              <div className={css(styles.titlebar, styles.clearfix)}>
                {/*<Link to={`/drive/${host.hostname}`} style={{float: 'left'}}>{host.hostname}</Link>*/}
                <a href={`http://${host.hostname}`} target="_blank">预览</a>
              </div>
              <div className={css(styles.titlebar, styles.clearfix)}>
                <div style={{float: 'left'}}>路由列表</div>
                <Link to={`/drive/${host.hostname}/location/new`}  style={{float: 'left'}}>
                  <Button type="primary" size="small">新建</Button>
                </Link>
              </div>
              <div className={css(styles.locationList)}>
                { (() => {
                  if (host.locations.length==0) return <div>路由列表为空</div>
                  return (
                    <table>
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
                        return Object.values(host.locations).sort((a,b) => a.sort - b.sort).map((location, index)=>{
                          return (
                            <tr key={location.pathname}>
                              <td><code>{location.pathname}</code></td>
                              <td>
                                <div>
                                  <button
                                    disabled={location.sort==1}
                                    onClick={() => location.sort!=1 & editLocationSort(hostname, location, 'up')}>
                                    <MdArrowUpward />
                                  </button>
                                  <button>{location.sort}</button>
                                  <button
                                    disabled={location.sort==Object.values(host.locations).length}
                                    onClick={() => location.sort!=Object.values(host.locations).length & editLocationSort(hostname, location, 'down')}>
                                    <MdArrowDownward />
                                  </button>
                                </div>
                              </td>
                              <td><code>{location.type}</code></td>
                              <td>
                                <div className="btn-group">
                                  <Link to={`/drive/${host.hostname}/location/pathname?pathname=${location.pathname}`}>详情</Link>
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
            </div>
        }

      </div>

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



export default module.exports = Location