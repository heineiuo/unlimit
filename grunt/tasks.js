module.exports = function(grunt){

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    concat: require('./config/concat'),
    jst: require('./config/jst'),
    uglify: require('./config/uglify'),
    sass: require('./config/sass'),
    cssmin: require('./config/cssmin'),
    copy: require('./config/copy'),
    clean: require('./config/clean'),
    webpack: require('./config/webpack'),
    watch: require('./config/watch')

  });

  // server
  grunt.registerTask('server', [
    'copy:server'
  ])


  // home
  grunt.registerTask('homejs', [
    'jst:home/template',
    'concat:home/index',
    'uglify:home/index',
    'copy:home'])

  grunt.registerTask('homecss', [
    'sass:home/index',
    'cssmin:home/index',
    'copy:home'])

  grunt.registerTask('r', [
    'webpack:server',
    'uglify:server',
    'copy:r'
  ])

  // default
  grunt.registerTask('default', [
    'jst',
    'concat',
    'uglify',
    'sass',
    'cssmin',
    'copy',
    'clean'])

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jst');


}