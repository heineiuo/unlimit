import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from '@react-web/card'
import Button from '@react-web/button'
import { StyleSheet, css } from 'aphrodite'
import Spin from 'react-spin'
import {push} from 'react-router-redux'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { withHover, Hover } from '@react-web/hover'
import commonStyles from '../components/commonStyles'
import { queryOne,  
    deleteHost,
    setTitle,
    queryList as getHostList,
    restoreFileList } from './'

const DriveListItem = props => (
  <Hover className={props.className}>
    {({isHovered}) => 
    <div>
      <div className={css(styles.hostItem__title)}>
        {props.item.name || `未命名(${props.item._id.substr(0, 8)})`}
      </div>
      <div className={css(styles.hostItem__info)}>
        简介: ...
      </div>
      <div className={css(styles.hostItem__bottomBar)}>
        <Link className={css(styles.link, styles.hostItem__bottomBar__btn)} to={`/drive/${props.item._id}`}>文件</Link>
      </div>
    </div>}
  </Hover>
)

class DriveList extends Component {

  static defaultProps = {
    style: {}
  };

  state = {
    hostName: '',
    page: 1
  };

  componentWillMount = () => {
    const {getHostList, hostListState} = this.props;
    if (hostListState === 0) getHostList();
  };

  _deleteHost = (host) => {
    console.log(host);
    this.props.deleteHost(host.driveId)
  };

  render(){
    const {style, hostListState, hostList, closeDropdown} = this.props;

    return (
      <div className={css(styles.container)}>
        <div className="list-area">
          {
            hostListState === 2 ?
              hostList.length === 0 ? '空间数量为0' :
              <div className={css(styles.hostList)}>
                {
                  hostList.map((item, index)=> (
                    <DriveListItem
                      className={css(styles.hostItem)}
                      key={index}
                      item={item}
                      closeDropdown={closeDropdown} />
                  ))
                }
              </div>:
              <Spin />
          }

        </div>

      </div>

    )
  }
}


const styles = StyleSheet.create({
  ...commonStyles,

  container: {
    margin: '0 auto',
    maxWidth: 1100,
    paddingTop: 20
  },

  titlebar: {
    marginBottom: 20,
    ':after': {
      clear: 'both',
      content: '',
      display: 'table'
    }
  },

  hostList: {
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around'
    justifyContent: 'flex-start'
  },

  hostItem: {
    boxSizing: 'border-box',
    margin: 8,
    width: '100%',
    // maxWidth: '300px',
    // backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },

  hostItem__title: {
    // backgroundColor: '#597aff',
    color: '#666',
    height: 50,
    padding: '0 10px',
    lineHeight: '50px'
  },
  hostItem__info: {
    borderBottom: '1px solid #EEE',
    padding: 10
  },
  hostItem__bottomBar: {
    // backgroundColor: '#FFF',
    color: '#333',
    height: 50,
    padding: '0 10px',
    lineHeight: '50px'
  },

  hostItem__bottomBar__btn: {
    // backgroundColor: '#effdff',
    padding: 4
  },

});


export default module.exports = connect(
  (state) => ({
    hostList: state.drive.hostList,
    hostListState: state.drive.hostListState,
  }),
  (dispatch) => bindActionCreators({
    push,
    deleteHost,
    setTitle,
    getHostList,
    restoreFileList,
  }, dispatch)
)(DriveList);


