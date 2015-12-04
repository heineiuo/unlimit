module.exports = function(grunt){

  // server
  grunt.registerTask('server', [
    'concat:server',
    'uglify:server',
    'copy:server'])


  // home
  grunt.registerTask('home/js', [
    'concat:home/index',
    'jst:home/template',
    'uglify:home/index',
    'copy:home'])

  grunt.registerTask('home/css', [
    'less:home/index',
    'cssmin:home/index',
    'copy:home'])

  // default
  grunt.registerTask('default', [
    'concat',
    'jst',
    'uglify',
    'sass',
    'cssmin',
    'copy',
    'clean'])
}