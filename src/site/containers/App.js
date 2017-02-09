import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute} from 'react-router'

import Home from './Home'
import Post from './PostDetail'
import CategoryDetail from './CategoryDetail'
import Page from './SpecialPage'

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={this.props.history} location={this.props.location}>
          <Route component={require('./Wrap')}>
            <Route path="/" component={Home} />
            <Route path="/post/:postId" component={Post} />
            <Route path="/category/:categoryName" component={CategoryDetail} />
            <Route path="/category/:categoryName/page/:pageNumber" component={CategoryDetail} />
            <Route path="/:pageName" component={Page} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

export default App
