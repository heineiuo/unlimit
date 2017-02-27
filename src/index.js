
const start = () => {
  const RenderApp = require('./RenderApp');
  const App = require('./App');
  const app = new RenderApp(App, document.getElementById('app'));
};

start();