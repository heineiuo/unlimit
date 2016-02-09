module.exports = {

  'release': {
    files: [
      {
        './build/Release/package.json': ['package.json']
      },
      {
        expand: true,
        cwd: './src',
        src: ['**/*.html', '!**/template/**/*.html'],
        dest: './build/Release/public/assets'
      },
      {
        expand: true,
        cwd: './src',
        src: ['**/images/**/*'],
        dest: './build/Release/public/assets'
      },
      {
        expand: true,
        cwd: './libs',
        src: ['**/*'],
        dest: './build/Release/public/libs'
      },
      {
        expand: true,
        cwd: './src/server/files',
        src: ['**/*'],
        dest: './build/Release/files'
      },
      {
        './build/Release/public/assets/home/css/index.css': ['.grunt/home/index.min.css'],
        './build/Release/public/assets/home/js/index.js': ['.grunt/home/index.min.js'],
        './build/Release/public/assets/home/js/template.js': ['.grunt/home/template.min.js']
      }

    ]
  }


}