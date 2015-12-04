
module.exports = {

  'home/index': {
    options: {
      banner: '/*! home/index.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
    },
    files: {
      '.grunt-cache/home/index.min.js': ['.grunt-cache/home/index.js']
    }
  },


  'server': {
    options: {
    },
    files: {
      '.grunt-cache/server/index.min.js': ['.grunt-cache/server/index.js']
    }
  }


}