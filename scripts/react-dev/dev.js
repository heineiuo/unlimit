const express = require('express');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const webpack = require('webpack');

/**
 * start server
 * @param parsedTargets
 * @param argv
 */
module.exports = (parsedTargets, argv) => {

  const app = express();

  if (!argv.preview) {
    parsedTargets.forEach( config => {

      config.entry.app.push(hotMiddlewareScript);
      config.devtool = 'inline-source-map';
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
      config.plugins.push(new webpack.NoErrorsPlugin());
      config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

      config.devServer = {
        hot: true,
        inline: true
      };

      const compiler = webpack(config);
      app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      }));
      app.use(require("webpack-hot-middleware")(compiler));
    });
  }


  app.route('*').all((req, res, next) => {
    try {
      res.sendFile(`${process.cwd()}/build/public/${req.path}`)
    } catch(e){
      res.sendStatus(404)
    }
  });

  app.use(express.static(`${process.cwd()}/build/public`));

  app.listen(argv.port, '127.0.0.1', (err) => {
    if (err) return console.log(err);
    console.log(`[webpack dev] Listening at http://127.0.0.1:${argv.port}`)
  })
};