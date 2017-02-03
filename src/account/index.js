import React from 'react'
import ReactDOM from 'react-dom'

// 兼容处理
import "babel-register"
import "babel-polyfill"
import "whatwg-fetch"
// import "drag-drop-touch-polyfill"
// import { syncHistoryWithStore } from 'react-router-redux'
// import createBrowserHistory from 'history/lib/createBrowserHistory'
// import injectTapEventPlugin from 'react-tap-event-plugin'
// injectTapEventPlugin();
import configure from "./store"
import shouldBrowserUpdate, {showTip} from 'react-sea/lib/ShouldBrowserUpdate'
import {hashHistory} from 'react-router'
import App from './containers/App'

window.onload = () => {
  if (shouldBrowserUpdate()) return showTip();
  const store = configure(hashHistory);
  ReactDOM.render(
    <App
      store={store}
      history={hashHistory}
      location="hashHistory"
    />,
    document.getElementById('app')
  );
};