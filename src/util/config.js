const fs = require('fs')

const getValue = (equalIndex, val) => {
  var value = val.substring(equalIndex+1)
  return value==''?true:value
}

const getArgv = () => {
  const argv = {}
  process.argv.forEach((val, index, array) => {
    if (val.substring(0, 2)=='--'){
      var equalIndex = val.indexOf('=')
      if (equalIndex<0) equalIndex = val.length
      argv[val.substring(2, equalIndex)] = getValue(equalIndex,val)
    }
  })
  return argv
}

const argv = getArgv()
const configPath = argv.config || `${process.cwd()}/data/config.json`
const configData = fs.readFileSync(configPath, 'utf-8')
const config = Object.assign(argv, JSON.parse(configData))

module.exports = config