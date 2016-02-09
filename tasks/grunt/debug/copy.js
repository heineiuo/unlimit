module.exports = {

  'debug': {
    files: [
      {
        expand: true,
        cwd: './src',
        src: ['**/*.html', '!**/template/**/*.html'],
        dest: './build/Debug/public/assets'
      },
      {
        expand: true,
        cwd: './src',
        src: ['**/images/**/*'],
        dest: './build/Debug/public/assets'
      },
      {
        expand: true,
        cwd: './libs',
        src: ['**/*'],
        dest: './build/Debug/public/libs'
      },
      {
        expand: true,
        cwd: './src/server',
        src: ['**/*.js'],
        dest: './build/Debug'
      },
      {
        expand: true,
        cwd: './src/server/files',
        src: ['**/*'],
        dest: './build/Debug/files'
      },
      {
        './build/Debug/public/assets/home/css/index.css': ['.grunt/home/index.css'],
        './build/Debug/public/assets/home/js/index.js': ['.grunt/home/index.js'],
        './build/Debug/public/assets/home/js/template.js': ['.grunt/home/template.js']
      }
    ]
  }


}