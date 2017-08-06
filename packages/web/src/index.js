import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'
import * as aphrodite from 'aphrodite'
import * as ReactRouterRedux from 'react-router-redux'
import ReactModal from 'react-modal'
import RenderApp from '@react-web/render'
import defaults from 'lodash/defaults'
import {store, history, injectAsyncReducer, AppWrapper} from '@react-web/store'
import React, {Component } from 'react'
import {HashRouter} from 'react-router-dom'
import './notice'
import drive from './drive'

injectAsyncReducer('drive', drive)

import App from './App'

const {ConnectedRouter} = ReactRouterRedux
const {Provider} = ReactRedux

const Router = HashRouter

defaults(global, {
  __SMILE_DEV: process.env.NODE_ENV !== 'production',
  API_HOST: `https://api.youkuohao.com`,
  __SMILE_API: `https://api.youkuohao.com`
})

;[
  {name: 'react', default: global.React},
  {name: 'react-dom', default: global.ReactDOM},
  {name: 'react-router-dom', default: ReactRouterDOM},
  {name: 'react-redux', default: ReactRedux},
  {name: 'react-router-redux', default: ReactRouterRedux},
  {name: 'redux', default: Redux},
  {name: 'react-modal', default: ReactModal},
  {name: 'aphrodite', default: aphrodite},
].forEach(item => {
  SystemJS.registry.set(
    SystemJS.resolveSync(item.name), 
    SystemJS.newModule(item.default) 
  );
})

SystemJS.config(global.__SYSTEM_CONFIG)

ReactDOM.render(
  <AppWrapper>
    <Router>
      <App />
    </Router>
  </AppWrapper>,
  document.getElementById('app')
);
