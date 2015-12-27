module.exports = {

  'home': {
    files: {
      './build/public/assets/home/css/index.min.css': ['.grunt-cache/home/index.min.css'],
      './build/public/assets/home/css/index.css': ['.grunt-cache/home/index.css'],
      './build/public/assets/home/js/index.min.js': ['.grunt-cache/home/index.min.js'],
      './build/public/assets/home/js/index.js': ['.grunt-cache/home/index.js'],
      './build/public/assets/home/js/template.min.js': ['.grunt-cache/home/template.min.js'],
      './build/public/assets/home/js/template.js': ['.grunt-cache/home/template.js']
    }
  },

  'server': {
    files: {
      './build/index.js': ['.grunt-cache/server/index.js'],
      './build/index.min.js': ['.grunt-cache/server/index.min.js'],
      './build/package.json': ['package.json']
    }
  }
}