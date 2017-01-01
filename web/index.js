import React from 'react';
import ReactDOM from 'react-dom';
// import { syncHistoryWithStore } from 'react-router-redux'
// import createBrowserHistory from 'history/lib/createBrowserHistory';

// 兼容处理
import "babel-register"
import "babel-polyfill"
import 'whatwg-fetch'
import 'drag-drop-touch-polyfill'
import shouldBrowserUpdate, {showTip} from 'react-components/ShouldBrowserUpdate'
import App from './containers/App'
import configure from './store'
import { hashHistory } from 'react-router'
// import { syncHistoryWithStore } from 'react-router-redux'
// import createBrowserHistory from 'history/lib/createBrowserHistory'


window.onload = () => {
  if (shouldBrowserUpdate()) return showTip();
  const store = configure(hashHistory);

  ReactDOM.render(
    <App
      store={store}
      location="hashHistory"
      history={hashHistory} />,
    document.getElementById('app')
  );

};