import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {store, history} from './store'
import {ConnectedRouter} from 'react-router-redux'
import ConnectCheckLogin from './CheckLogin'

class App extends Component {

  render (){

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ConnectCheckLogin />
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App;