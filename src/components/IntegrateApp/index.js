import React, {Component} from 'react'
import Spin from 'react-spin'
import {css, StyleSheet} from 'aphrodite/no-important'

class IntegrateApp extends Component {
  state = {
    appState: 0
  };

  componentDidMount = async () => {
    const {account, location} = this.props;

    try {
      const {appName} = this.props.params;
      this.setState({appState: 1});
      const urls = {
        smilelist: 'http://local.youkuohao.com/smilelist@0.0.1/dist/smilelist.js',
        familytree: 'http://127.0.0.1:8084/dist/familytree.js',
        'smile-text-editor': 'http://127.0.0.1:8087/dist/smile-text-editor.js'
      };
      if (!urls.hasOwnProperty(appName)) {
        return this.mountPoint.innerHTML = `应用程序（${appName}）未找到:( <br> <a href="/">回到首页</a>`
      }

      const url = urls[appName];
      const app = await SystemJS.import(url);
      this.setState({appState: 2});
      app(this.mountPoint, {account, location});
    } catch(e){
      console.error(e);
      this.setState({appState: 4})
    }

  };

  render() {
    const {appState} = this.state;
    return (
      <div ref={div => this.mountPoint = div}>
        {
          appState == 4? 'app加载失败': appState < 2?
              <Spin />: null
        }
      </div>
    )
  }
}

export default module.exports = IntegrateApp