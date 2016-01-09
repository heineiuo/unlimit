module.exports = function(grunt){

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    concat: require('./config/concat'),
    jst: require('./config/jst'),
    uglify: require('./config/uglify'),
    less: require('./config/less'),
    sass: require('./config/sass'),
    cssmin: require('./config/cssmin'),
    copy: require('./config/copy'),
    clean: require('./config/clean'),
    webpack: require('./config/webpack'),
    watch: require('./config/watch')

  });

  // server
  grunt.registerTask('server', [
    'webpack:server',
    'uglify:server'
  ])


  // home
  grunt.registerTask('home/js', [
    'jst:home/template',
    'concat:home/index',
    'uglify:home/index',
    'copy:home'])

  grunt.registerTask('home/css', [
    'sass:home/index',
    'cssmin:home/index',
    'copy:home'])

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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-webpack');


}