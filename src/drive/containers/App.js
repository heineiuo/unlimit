import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute} from 'react-router'

class App extends Component {

  render(){
    return (
      <Provider store={this.props.store}>
        <Router history={this.props.history} location={this.props.location}>
          <Route component={require('./Master')}>
            <Route path="/" component={require('./HostWrapper')}>
              <IndexRoute component={require('./HostFile')} />
              <Route path=":hostname" component={require('./HostFile')} />
              <Route path=":hostname/location">
                <IndexRoute component={require('./Location')} />
                <Route path="new" component={require('./LocationDetail')}/>
                <Route path="pathname" component={require('./LocationDetail')}/>
              </Route>
            </Route>
          </Route>
        </Router>
      </Provider>
    )
  }
}

export default App