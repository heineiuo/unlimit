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
import Master from '../containers/Master'
import Home from '../containers/Home'
import Host from '../containers/Host'
import File from '../containers/File'
import Cli from '../containers/Cli'

const store = configure()


window.onload = function(){

  ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory} location="hashHistory">
        <Route component={Master}>
          <Route path="/" component={Home}/>
          <Route path="/host">
            <IndexRoute component={Host} />
            <Route path="new" component={Host} />
            <Route path=":host_id">
              <IndexRoute component={FamilyTree}/>
              <Route path="location/new" component={FamilyTree}/>
              <Route path="location/:location_id" component={FamilyTree}/>
            </Route>
          </Route>
          <Route path="/file" component={File}/>
          <Route path="/cli" component={Cli}/>
        </Route>
      </Router>
    </Provider>

  ), document.getElementById('app'))
}
