import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'

window.ReactRouterDOM = ReactRouterDOM
window.Redux = Redux
window.ReactRedux = ReactRedux

const start = () => {
  const RenderApp = require('react-sea/lib/RenderApp');
  const App = require('./App');
  const app = new RenderApp(App, document.getElementById('app'));
};

start()