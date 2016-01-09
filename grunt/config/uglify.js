
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
      compress: {
        if_return: true,
        comparisons:true,
        dead_code: true,
        properties: true,
        drop_debugger: true
        //drop_console: true
      },
      mangle: {
        sort: true,
        toplevel: true,
        eval: true
      },
      banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
    },
    files: {
      'build/Debug/index.js': ['.grunt/server/index.js']
    }
  }


}