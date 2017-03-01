import React from 'react'
import ReactDOM from 'react-dom'

class RenderApp {
  constructor(App, container, props) {
    this._App = App;
    this._container = container;
    this._props = props;
    this._render();
  }

  _render() {
    ReactDOM.render(
      React.createElement(this._App, this._props),
      this._container
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this._container);
  }
}

module.exports = RenderApp;