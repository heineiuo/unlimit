const argv = {}

process.argv.forEach((val, index, array) => {
  if (val.substring(0, 2)=='--'){
    var equalIndex = val.indexOf('=')
    if (equalIndex<0) equalIndex = val.length
    argv[val.substring(2, equalIndex)] = val.substring(equalIndex+1)
  }
})

module.exports = argv