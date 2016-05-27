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
import configure from '../dataflow/store/store__dashboard'
// containers
import Master from '../containers/Master'
import Home from '../containers/Home'
import HostList from '../containers/HostList'
import HostDetail from '../containers/HostDetail'
import HostNew from '../containers/HostNew'
import LocationDetail from '../containers/LocationDetail'
import LocationNew from '../containers/LocationNew'
import File from '../containers/File'
import FileList from '../containers/FileList'
import Cli from '../containers/Cli'

const store = configure(hashHistory)

window.onload = function(){

  ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory} location="hashHistory">
        <Route component={Master}>
          <Route path="/" component={Home}/>
          <Route path="/host">
            <IndexRoute component={HostList} />
            <Route path="new" component={HostNew} />
            <Route path=":host_id">
              <IndexRoute component={HostDetail}/>
              <Route path="location/new" component={LocationNew}/>
              <Route path="location/:location_id" component={LocationDetail}/>
            </Route>
          </Route>
          <Route path="/file">
            <IndexRoute component={FileList} />
            <Route path=":file_id" component={File} />
          </Route>
          <Route path="/cli" component={Cli}/>
        </Route>
      </Router>
    </Provider>

  ), document.getElementById('app'))
}
