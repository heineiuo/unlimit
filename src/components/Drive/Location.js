import React, {Component} from 'react'
import {Link} from 'react-router'
import Input from 'react-sea/lib/Input'
import MdArrowUpward from 'react-sea/lib/Icons/arrow-upward'
import MdArrowDownward from 'react-sea/lib/Icons/arrow-downward'
import { StyleSheet, css } from 'aphrodite'
import Button from 'react-sea/lib/Button'
import Spin from 'react-spin'
import LocationItem from './LocationItem'

class Location extends Component {

  state = {
    locations: []
  };

  componentDidMount = () => {
    const {getLocations, params: {hostname}} = this.props;
    getLocations(hostname);
  };

  componentWillReceiveProps = (nextProps) => {
    const {locations} = nextProps.host;
    this.setState({
      locations: Object.values(locations).map(location => {
        delete location.sort;
        return location
      })
    })
  };

  saveLocation = () => {
    const {params: {hostname}} = this.props;
    const {locations} = this.state;
    console.log(JSON.stringify(this.state.locations));
    this.props.commitLocations(hostname, locations)
  };

  handleItemChange = (item) => {
    const {location, changePart} = item;
    const {locations} = this.state;
    // console.log(location.pathname, changePart);
    const nextLocations = locations.slice();
    nextLocations.splice(location.sort - 1, 1, Object.assign({}, locations[location.sort - 1], changePart));
    // console.log(nextLocations);
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
        pathname: '/^.*$/',
        type: 'HTML',
        content: ''
      })
    })
  };

  render () {
    const {host: {locationState}, params: {hostname}} = this.props;
    const {locations} = this.state;

    return (
      <div style={{padding: '20px 0', margin: '0 auto', maxWidth: 1000}}>
        {
          locationState < 2?
            <Spin />:
            <div>
              <div className={css(styles.titleBar)}>
                <div>路由列表</div>
                <div>
                  <Button onClick={this.saveLocation}>保存</Button>
                </div>
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
                      locations.length==0 ? <div>路由列表为空</div>:
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
    justifyContent: 'space-between',
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

  }


});



export default module.exports = Location