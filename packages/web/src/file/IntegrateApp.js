import React, {Component} from "react"
import Spin from "react-spin"
import {css, StyleSheet} from "aphrodite"
import {appmeta} from './appmeta'
import Loader from '@react-web/async-loader'
import {withRouter, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

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
    console.log(options)
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
    
    // const nextState = {appName, fileId, fileName, driveId, appState: 1, isCreated};
    // if (appmeta.findIndex(app => app.appName === appName) === -1 || !SystemJS.map.hasOwnProperty(appName)) {
    //   nextState.appState = 3;
    //   return this.setState(nextState);
    // }
    // this.setState(nextState);
    // try {
    //   const hoc = await SystemJS.import(appName);
    //   // todo consider if  injectAsyncReducer is safety or need.
    //   this.component = hoc({injectAsyncReducer});
    //   nextState.appState = 2
    // } catch (e) {
    //   console.error(e);
    //   nextState.appState = 4
    // } finally {
    //   console.log('integrate app open finally');
    //   console.log(nextState.appState)
    //   this.setState(nextState)
    // }

  };

  componentWillUnmount = () => {
    console.log('integrate app: unmount')
  }

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

  //   console.log(`appState: ${appState}`)

  //   return appState === 4 ? 
  //     <div style={{color: 'red', fontFamily: 'monospace', fontSize: 13}}>
  //       <div onClick={this.close} className={css(styles.appToolBar__btn)} style={{width: 100}}>关闭应用</div>
  //       <div>{`app(${appName})加载失败:(`}</div>
  //     </div> :
  //     appState === 3 ? 
  //       <div>
  //         <div>{`app(${appName}）不存在:( `}</div>
  //         <a href="/">回到首页</a>
  //       </div> :
  //       appState === 1 ? 
  //         <Spin /> :
  //         appState === 2? 
  //           <div className={css(styles.edit, fullScreen && styles.edit_fullScreen)}>
  //             <div className={css(styles.appToolBar)} style={fullScreen?{position: 'absolute'}:{}}>
  //               <div onClick={this.toggleFullScreen} className={css(styles.appToolBar__btn)}>全屏</div>
  //               <div onClick={this.close} className={css(styles.appToolBar__btn)}>关闭应用</div>
  //             </div>
  //               {
  //                 React.createElement(this.component, {
  //                   appState,
  //                   appName,
  //                   driveId,
  //                   fileId,
  //                   fileName,
  //                   isCreated
  //                 })
  //               }
  //           </div>: 
  //           appState === 0 ?
  //             <div>还未初始化</div> :
  //             <div>出错了</div>
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
