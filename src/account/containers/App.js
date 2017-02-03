import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute} from 'react-router'

class App extends Component {

  render (){
    return (
      <Provider store={this.props.store}>
        <Router history={this.props.history} location="hashHistory">
          <Route path="/" component={require('./Check')}  />
          {/*<Route path="/forgot-password" component={require("./__archive/ForgotPassword")} />
          <Route path="/help" component={require("./Help")} />*/}
        </Router>
      </Provider>
    )
  }
}

export default App

