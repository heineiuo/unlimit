module.exports = function(grunt){

  // server
  grunt.registerTask('server', [
    'jst:home/app',
    'concat:server',
    'uglify:server',
    'copy:server'])


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
}