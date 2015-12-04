
module.exports = {
  files: ['Gruntfile.js', 'src/**/*.js', 'src/**/*.less', 'src/**/*.html'],
  tasks: ['concat','jst', 'uglify', 'less', 'cssmin', 'copy', 'clean']
}