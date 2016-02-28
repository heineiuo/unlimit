var _ = require('lodash')

var tasks = [
  'copy',
  'uglify',
  'webpack'
]

var conf = {}

_.map(tasks, function(item, index){
  conf[item] = {}
  conf[item] = _.assign(conf[item], require('./debug/'+item))
  conf[item] = _.assign(conf[item], require('./release/'+item))
})


module.exports = function(grunt){

  conf.pkg = grunt.file.readJSON('package.json')

  grunt.initConfig(conf);

  grunt.registerTask('debug', [
    'webpack:debug_serverIndexJS',
    'copy:debug'
  ])

  grunt.registerTask('release', [
    'webpack:serverIndexJS',
    'uglify:serverIndexJS',
    'copy:release'
  ])

  grunt.loadNpmTasks('grunt-webpack')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-copy')


}