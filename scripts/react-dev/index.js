const fs = require('fs');

const argv = {
  port: 8083
};

process.argv.forEach(val => {
  if (val.substring(0, 2)=='--'){
    let equalIndex = val.indexOf('=');
    if (equalIndex < 0) equalIndex = val.length;
    argv[val.substring(2, equalIndex)] = val.substring(equalIndex+1) || true;
  }
});

const configFilename = argv.configFilename || `${process.cwd()}/react-dev.json`;
const config = JSON.parse(fs.readFileSync(configFilename, 'utf-8'));
const configure = require('./configure');

console.log(`[webpack argv] ${JSON.stringify(argv)}`);

const parsedTargets = config.targets.filter(item => !item.disable).map(target => {
  console.log(`[webpack target] key: ${target.key}, filename: ${target.filename}`);
  return configure({
    target: target,
    clientName: target.key,
    outputDir: target.outputDir,
    sourceFileName: `${process.cwd()}/${target.filename}`,
    notCompress: true,
  }, argv)
});

if (argv.build){
  require('./build')(parsedTargets, argv)
} else {
  require('./dev')(parsedTargets, argv)
}
