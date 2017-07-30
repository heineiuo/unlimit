import React, {Component} from 'react'
import * as aphrodite from 'aphrodite'
import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'
import * as ReactRouterRedux from 'react-router-redux'
import {HashRouter} from 'react-router-dom'
import {store, history, AppWrapper} from '@react-web/store'
import RenderApp from '@react-web/render'
import ReactModal from 'react-modal'

import App from './App'

global.ReactRouterDOM = ReactRouterDOM
global.Redux = Redux
global.ReactRedux = ReactRedux

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
  )
})

SystemJS.config(global.__SYSTEM_CONFIG)

const Router = HashRouter

const app = new RenderApp(() =>
  <AppWrapper>
    <App />
  </AppWrapper>, 
document.getElementById('app'))
