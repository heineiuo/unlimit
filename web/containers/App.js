import React, {Component} from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'


class App extends Component {

  render(){
    return (

      <Provider store={this.props.store}>
        <Router history={this.props.history} location={this.props.location}>
          <Route component={require('./Master')}>
            <Route path="/" component={require('./Host')}>
              <IndexRoute component={require('./HostList')} />
              <Route path="/host" component={require('./HostList')} />
              <Route path="/host/:hostname" component={require('./HostDetail')}>
                <Route path="location">
                  <IndexRoute component={require('./HostForm')} />
                  <Route path="new" component={require('./LocationDetail')}/>
                  <Route path="pathname" component={require('./LocationDetail')}/>
                </Route>
                <Route path="file">
                  <IndexRoute component={require('./File')} />
                  <Route path=":file_id" component={require('./File')} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Router>
      </Provider>
    )
  }
}

export default App