import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import IntegrateApp from './index'

class IntegrateAppModal extends Component {

  componentDidMount = async () => {
    const {appName} = this.props.params;
    if (appName == 'smilelist') {
      const smilelist = await SystemJS.import(`http://local.youkuohao.com/smilelist@0.0.1/dist/smilelist.js`);
      smilelist(this.mountPoint)
    } else if (appName == 'familytree') {
      // const app = await SystemJS.import(`http://local.youkuohao.com/familytree@0.0.1/dist/familytree.js`);
      const app = await SystemJS.import(`http://127.0.0.1:8084/dist/familytree.js`);
      app(this.mountPoint)
    } else {
      this.mountPoint.innerHTML = `应用程序（${appName}）未找到:( <br> <a href="/">回到首页</a>`
    }

  };

  render() {
    return (
      <div ref={div => this.mountPoint = div}/>
    )
  }
}

export default module.exports = IntegrateAppModal