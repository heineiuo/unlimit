import React, {Component} from "react"
import Spin from "react-spin"
import {css, StyleSheet} from "aphrodite"
import Loader from '@react-web/async-loader'
import {withRouter, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {appmeta} from './appmeta'

class IntegrateApp extends Component {
  static defaultProps = {
    onClose: () => {},
    injectAsyncReducer: () => {}
  };

  state = {
    appState: 0, // 0未初始化， 1正在加载，2加载成功，3，app不存在，4加载失败
    appName: null,
    driveId: '',
    fileName: '',
    fullScreen: false,
    isCreated: true
  };

  open = (options) => {
    const {injectAsyncReducer} = this.props;
    const {driveId, fileId, fileName, appName, isCreated=true} = options;
    
    this.setState({
      appName, 
      fileId, 
      fileName, 
      driveId, 
      appState: 1, 
      isCreated,
    })
    return null;
    
  };

  close = () => {
    this.setState({
      appState: 0,
      appName: null,
      fullScreen: false,
      driveId: null,
      fileName: null
    });
    this.component = null;
    this.props.onClose()
  };

  toggleFullScreen = () => {
    this.setState({
      fullScreen: !this.state.fullScreen
    })
  };

  render() {
    const {fullScreen, appState, appName, driveId, fileName, fileId, isCreated} = this.state;
    console.log('integrate app: render' + appName)
    const {account, file} = this.props

    if (!appName) return <div></div>;

    return (
      <Loader 
        {...{fullScreen, appState, appName, driveId, fileName, fileId, isCreated}}
        load={cb => SystemJS.import(appName).then(CurrentApp => cb(null, CurrentApp)).catch(cb)}
        loadKey={appName}
      />
    )

  }
}

const styles = StyleSheet.create({

  edit: {
    display: 'block'
  },

  edit_fullScreen: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#FFF',
    zIndex: 2000,
  },

  ///////////

  appToolBar: {
    display: 'flex',
    flexDirection: 'flex-end',
    alignItems: 'center',
    zIndex: 1001
  },

  appToolBar__btn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFF',
    padding: '4px 10px',
    cursor: 'pointer'
  },
});

export default connect(
  store => ({
    account: store.account,
    file: store.file
  }),
  dispatch => bindActionCreators({

  }, dispatch),
  null,
  {
    withRef: true
  }
)(IntegrateApp)
