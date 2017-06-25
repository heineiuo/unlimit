import React, {Component} from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory, createMemoryHistory } from 'react-router'
import { syncHistoryWithStore, push } from 'react-router-redux'
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import {Urlencode} from '../utils/fetch-tools'
import {toggleOpen} from '../store/display'

import configure from '../store'

class App extends Component {

  componentWillMount = () => {

    const {initialState} = this.props;
    const history = this.history = createMemoryHistory();
    this.store = configure(history, initialState);

  };

  openChat = (options) => {
    this.store.dispatch(toggleOpen(true));
    this.store.dispatch(push(`/chat?${Urlencode(options)}`))
  };
  addFriend = (options) => {
    this.store.dispatch(toggleOpen(true));
    this.store.dispatch(push(`/add?${Urlencode(options)}`))
  };

  render(){
    return (
      <Provider store={this.store}>
        <Router history={this.history}>
          <Route path="/" component={require('./Wrap')}>
            <IndexRoute component={require('./NavWrap')} />
            <Route component={require('./SecondLevel')}>
              <Route path="/add" component={require('./SearchUser')} />
              <Route path="/notification" component={require('./Notification')} />
              {/*<Route path="/theme" component={require('./Theme')} />*/}
              {/*<Route path="/info" component={require('./Info')} />*/}
            </Route>
            <Route path="/chat" component={require('./ChatWindow')} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

// <Provider store={store}>
//   <Router history={memoryHistory}>
//     <Route path="/" getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./Wrap'))})}>
//       <IndexRoute getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./NavWrap'))})} />
//       <Route getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./SecondLevel'))})}>
//         <Route path="/add" getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./SearchUser'))})} />
//         <Route path="/notification" getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./Notification'))})} />
//         <Route path="/theme" getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./Theme'))})} />
//         <Route path="/info" getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./Info'))})} />
//       </Route>
//       <Route path="/chat/:userId" getComponent={(n, cb) => require.ensure([], (require) => {cb(null, require('./ChatWindow'))})} />
//     </Route>
//   </Router>
// </Provider>

export default App