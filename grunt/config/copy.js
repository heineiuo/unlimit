module.exports = {

  'home': {
    files: {
      './dist/public/assets/home/css/index.min.css': ['.grunt-cache/home/index.min.css'],
      './dist/public/assets/home/css/index.css': ['.grunt-cache/home/index.css'],
      './dist/public/assets/home/js/index.min.js': ['.grunt-cache/home/index.min.js'],
      './dist/public/assets/home/js/index.js': ['.grunt-cache/home/index.js'],
      //'./dist/public/assets/home/js/template.min.js': ['.grunt-cache/home/template.min.js'],
      './dist/public/assets/home/js/template.js': ['.grunt-cache/home/template.js'],
      './dist/view/home/index.html': ['src/home/index.html']
    }
  },

  'server': {
    files: {
      './dist/index.js': ['.grunt-cache/server/index.js'],
      './dist/index.min.js': ['.grunt-cache/server/index.min.js'],
      './dist/package.json': ['package.json']
    }
  }
}