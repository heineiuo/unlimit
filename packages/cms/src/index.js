import RenderApp from '@react-web/render'
import App from './App'
import * as aphrodite from 'aphrodite'

import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'

window.ReactRouterDOM = ReactRouterDOM
window.Redux = Redux
window.ReactRedux = ReactRedux

SystemJS.set(SystemJS.normalizeSync('react'), SystemJS.newModule({'default': window.React , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-dom'), SystemJS.newModule({'default': window.ReactDOM , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-router-dom'), SystemJS.newModule({'default': window.ReactRouterDOM , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('react-redux'), SystemJS.newModule({'default': window.ReactRedux , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('redux'), SystemJS.newModule({'default': window.Redux , __useDefault: true }) );
SystemJS.set(SystemJS.normalizeSync('aphrodite'), SystemJS.newModule({'default': aphrodite , __useDefault: true }) );

SystemJS.config(global.__SYSTEM_CONFIG)

const start = () => {
  const app = new RenderApp(App, document.getElementById('app'));
};
start()
