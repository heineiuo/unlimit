const webpack = require('webpack');

module.exports = (parsedTargets, argv) => {

  parsedTargets.forEach(config => {
    console.log(`[webpack build] building ${config.options.clientName}`);

    const compiler = webpack(config);

    compiler.run((err, stats) => {
      if (err) return console.error(`[webpack build] ${err.stack||e}`);
      console.log(`[webpack build] ${config.options.clientName} success`);
    })

  });

};