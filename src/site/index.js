import React from 'react'
import ReactDOM from 'react-dom'
// import { syncHistoryWithStore } from 'react-router-redux'
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import {hashHistory} from 'react-router'
import "babel-register" // 兼容处理
import "babel-polyfill"
import 'whatwg-fetch'
import 'drag-drop-touch-polyfill'
import shouldBrowserUpdate, {showTip} from 'react-sea/lib/ShouldBrowserUpdate'
import configure from './store'
import App from './containers/App'

window.onload = () => {

  const store = configure(hashHistory);
  if (shouldBrowserUpdate()) return showTip();
  ReactDOM.render((
    <App
      location="hashHistory"
      history={hashHistory}
      store={store} />
  ), document.getElementById('app'));
};