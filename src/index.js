const start = () => {
  const RenderApp = require('react-sea/lib/RenderApp');
  const App = require('./App');
  const app = new RenderApp(App, document.getElementById('app'));
};

export default module.exports = start;