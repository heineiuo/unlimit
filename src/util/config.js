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

if (!argv.hasOwnProperty('datadir')) argv.datadir = 'data'

console.log(argv.datadir)

if (argv.datadir[0] != '/') argv.datadir = `${process.cwd()}/${argv.datadir}`

const configData = fs.readFileSync(`${argv.datadir}/config.json`, 'utf-8')

const config = Object.assign(argv, JSON.parse(configData))

export default config