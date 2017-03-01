import React, {Component} from 'react'
import Spin from 'react-spin'
import {css, StyleSheet} from 'aphrodite/no-important'

class IntegrateApp extends Component {
  state = {
    appState: 0, // 0未初始化， 1正在加载，2加载成功，3，app不存在，4加载失败
    target: {}
  };

  componentDidMount = async () => {
    const {params: {appName}, injectAsyncReducer} = this.props;
    const urls = ['familytree', 'smile-text-editor'];
    if (urls.indexOf(appName) == -1 || !SystemJS.map.hasOwnProperty(appName)) {
      return this.setState({appState: 3, target: {appName}});
    }

    this.setState({appState: 1});

    try {
      const app = await SystemJS.import(appName);
      this.component = app(injectAsyncReducer);

      this.setState({
        appState: 2
      });

    } catch(e){
      console.error(e);
      this.setState({
        appState: 4,
        target: {appName}
      })
    }

  };

  render() {
    const {appState, target: {url, appName}} = this.state;
    return (
      <div ref={div => this.mountPoint = div}>
        {
          appState == 4? (
            <div style={{color: 'red', fontFamily: 'monospace', fontSize: 13}}>{`app(${appName})加载失败:(`}</div>
          ):
            appState == 3 ? (
              <div>
                <div>{`app(${appName}）不存在:( `}</div>
                <a href="/">回到首页</a>
              </div>
            ):
              appState < 2? <Spin />:
                React.createElement(this.component, {})
        }
      </div>
    )
  }
}

export default module.exports = IntegrateApp