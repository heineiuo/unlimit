
module.exports = {

  assetsHomeIndexJS: {
    options: {
      banner: '/*! home/index.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    files: [
      {
        '.grunt/home/index.min.js': ['.grunt/home/index.js']
      }
    ]
  },

  assetsHomeTemplateJS: {
    options: {
      banner: '/*! template.js v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    files: [
      {
        '.grunt/home/template.min.js': ['.grunt/home/template.js']
      }
    ]
  },


  serverIndexJS: {
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
      'build/Release/index.js': ['.grunt/server/index.js']
    }
  }


}