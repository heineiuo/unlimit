import React, {Component} from 'react'
import {Link} from 'react-router'
import Spin from 'react-spin'
import {css, StyleSheet} from 'aphrodite/no-important'

/**
 * 集成APP
 * 用户
 * TAG
 * 消息
 * 空间
 */

class Admin extends Component {
  state = {
    appState: 0,
    target: {}
  };

  componentDidMount = async () => {
    const {account, location,} = this.props;
    const appName = 'admin';
    const urls = {
      admin: 'http://127.0.0.1:8088/dist/smile-admin.js',
    };
    if (!urls.hasOwnProperty(appName)) {
      return this.mountPoint.innerHTML = `应用程序（${appName}）未找到:( <br> <a href="/">回到首页</a>`
    }

    const url = urls[appName];
    this.setState({appState: 1});

    try {
      const app = await SystemJS.import(url);
      this.setState({
        appState: 2
      });
      app(this.mountPoint, {account, location});
    } catch(e){
      console.error(e);
      this.setState({
        appState: 4,
        target: {appName, url}
      })
    }

  };

  render() {
    const {appState, target: {url, appName}} = this.state;
    return (
      <div ref={div => this.mountPoint = div}>
        {
          appState == 4? (
            <div style={{color: 'red', fontFamily: 'monospace', fontSize: 13}}>{`app(${appName})加载失败, 请检查：${url}`}</div>
          ):
            appState < 2? <Spin />:
              null
        }
      </div>
    )
  }
}

export default module.exports = Admin