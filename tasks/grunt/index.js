var _ = require('lodash')

var tasks = [
  'cacheBust',
  'clean',
  'copy',
  'cssmin',
  'jst',
  'sass',
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
    'clean:debugPublic',
    'jst:debug_assetsHomeTemplate',
    'sass:debug_assetsHomeIndexCSS',
    'webpack:debug_homeIndexJS',
    'webpack:debug_serverIndexJS',
    'copy:debug'
  ])

  grunt.registerTask('release', [
    'clean:releasePublic',
    'jst:assetsHomeTemplate',
    'sass:assetsHomeIndexCSS',
    'cssmin:assetsHomeIndexCSS',
    'webpack:homeIndexJS',
    'webpack:serverIndexJS',
    'uglify:serverIndexJS',
    'uglify:assetsHomeIndexJS',
    'uglify:assetsHomeTemplateJS',
    'copy:release',
    'cacheBust:assets'
  ])


  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-cache-bust');


}