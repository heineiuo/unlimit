import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
// import { syncHistoryWithStore } from 'react-router-redux'
// import createBrowserHistory from 'history/lib/createBrowserHistory';

// 兼容处理
import "babel-register"
import "babel-polyfill"
import 'whatwg-fetch'
// import '../util/DragDropTouch'


// store
import configure from '../dataflow/store'
// containers
import FamilyTree from '../containers/FamilyTree'

const store = configure()


window.onload = function(){

  ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory} location="hashHistory">
        <Route path="/" component={FamilyTree}/>
      </Router>
    </Provider>

  ), document.getElementById('app'))
}
