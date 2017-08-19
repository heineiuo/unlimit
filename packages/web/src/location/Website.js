import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Input from '@react-web/input'
import { StyleSheet, css } from 'aphrodite'
import Button from '@react-web/button'
import Spin from 'react-spin'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import LocationItem from './LocationItem'
import { queryList as getHostList,
  mutateLocations as commitLocations  } from '../drive'
import { restoreFileList } from '../file'

class Location extends Component {

  state = {
    locations: []
  };

  componentWillReceiveProps = (nextProps) => {
    const {locations} = nextProps.host;
    this.setState({
      locations
    })
  };

  saveLocation = () => {
    const {match: {params: {driveId}}} = this.props;
    const {locations} = this.state;
    console.log(JSON.stringify(this.state.locations));
    this.props.commitLocations(driveId, locations)
  };

  handleItemChange = (item) => {
    const {type, location, changePart} = item;
    const {locations} = this.state;
    const nextLocations = locations.slice();

    if (type === 'UPDATE') {
      // console.log(location.pathname, changePart);
      nextLocations.splice(location.sort - 1, 1, Object.assign({}, locations[location.sort - 1], changePart));
      // console.log(nextLocations);
    } else if (type === 'DELETE') {
      nextLocations.splice(location.sort - 1, 1)
    }

    this.setState({
      locations: nextLocations
    })

  };

  // 先把原来位置的删掉，再在目标位置添加
  editLocationSort = (location, nextSort) => {
    const {locations} = this.state;
    const nextLocations = locations.slice();
    if (nextSort < 1 || nextSort > locations.length) return false;
    nextLocations.splice(location.sort - 1 , 1);
    nextLocations.splice(nextSort - 1, 0, location);
    this.setState({
      locations: nextLocations
    })
  };

  addLocation = () => {
    this.setState({
      locations: this.state.locations.slice().concat({
        pathname: '*',
        type: 'HTML',
        content: ''
      })
    })
  };

  render () {
    const {host: {locationState, currentDriveName, domains}, match: {params: {driveId}}} = this.props;
    const {locations} = this.state;

    return (
      <div style={{padding: '20px 0', margin: '0 auto', maxWidth: 1000}}>
        {
          locationState < 2?
            <Spin />:
            <div>
              <div className={css(styles.domains)}>
                <div>域名绑定</div>
                <div>自动分配域名： {`${currentDriveName}.youkuohao.com`}</div>
                <div>自定义域名{JSON.stringify(domains)}</div>
              </div>
              <div className={css(styles.titleBar)}>
                <div style={{width: 100}}>路由列表</div>
                <Button size="small" style={{width: 50}} onClick={this.saveLocation}>保存</Button>
              </div>
              <div className={css(styles.locationList)}>
                <div className={css(styles.table)}>
                  <div className={css(styles.table__head)}>
                    <div style={{width: 100}}>优先级</div>
                    <div style={{flex: 1}}>路由</div>
                    <div style={{flex: 1}}>类型</div>
                    <div style={{flex: 1}}>操作</div>
                  </div>
                  <div className={css(styles.table__body)}>
                    {
                      locations.length === 0 ? 
                        <div>路由列表为空</div> :
                        locations.map((location, index) => (
                          <LocationItem
                            locationLength={locations.length}
                            location={Object.assign({}, location, {sort: index+1})}
                            onChange={this.handleItemChange}
                            editLocationSort={this.editLocationSort}
                            key={`${index}`} />
                        ))
                    }
                  </div>
                </div>
                <div>
                  <Button onClick={this.addLocation} style={{width: 100}} type="primary" size="small">增加</Button>
                </div>
              </div>
            </div>
        }
      </div>

    )
  }
}

const styles = StyleSheet.create({
  titleBar: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: '5px 0',
  },
  locationList: {

  },
  table__head: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F1F1F5',
    padding: '5px 10px',

  },
  table__body: {

  },

  domains: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: '1px solid #eaeaf1'
  }


});


export default connect(
  state => ({
    host: state.drive,
  }),
  dispatch => bindActionCreators({
    push,
    getHostList,
    commitLocations,
    restoreFileList,
  }, dispatch)
)(Location)
