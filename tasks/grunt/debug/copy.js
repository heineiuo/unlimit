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
      //{
      //  expand: true,
      //  cwd: './libs',
      //  src: ['**/*'],
      //  dest: './build/Debug/public/libs'
      //},
      {
        expand: true,
        cwd: './src/server',
        src: ['**/*.js'],
        dest: './build/Debug'
      },
      {
        './build/Debug/public/assets/home/css/index.css': ['.grunt/home/index.css'],
        './build/Debug/public/assets/home/js/index.js': ['.grunt/home/index.js'],
        './build/Debug/public/assets/home/js/template.js': ['.grunt/home/template.js'],
        './build/Debug/public/assets/home/js/components.js': ['.grunt/home/tag.js']
      },
      {
        './build/Debug/public/assets/admin/css/index.css': ['.grunt/admin/index.css'],
        './build/Debug/public/assets/admin/js/index.js': ['.grunt/admin/index.js'],
        './build/Debug/public/assets/admin/js/template.js': ['.grunt/admin/template.js']
      }
    ]
  }


}