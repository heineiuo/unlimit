import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'

window.ReactRouterDOM = ReactRouterDOM
window.Redux = Redux
window.ReactRedux = ReactRedux

SystemJSJS.set(SystemJS.normalizeSync('react'), SystemJS.newModule({'default': window.React , __useDefault: true }) );
SystemJSJS.set(SystemJS.normalizeSync('react-dom'), SystemJS.newModule({'default': window.ReactDOM , __useDefault: true }) );
SystemJSJS.set(SystemJS.normalizeSync('react-router-dom'), SystemJS.newModule({'default': window.ReactRouterDOM , __useDefault: true }) );
SystemJSJS.set(SystemJS.normalizeSync('react-redux'), SystemJS.newModule({'default': window.ReactRedux , __useDefault: true }) );
SystemJSJS.set(SystemJS.normalizeSync('redux'), SystemJS.newModule({'default': window.Redux , __useDefault: true }) );

const start = () => {
  const RenderApp = require('react-sea/lib/RenderApp');
  const App = require('./App');
  const app = new RenderApp(App, document.getElementById('app'));
};

start()
