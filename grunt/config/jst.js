function replaceTemplateName(name){
  return function(filepath){
    return filepath.replace('src/'+name+'/template/','').replace('.html', '')
  }
}

module.exports = {

  options: {
    templateSettings: {
      interpolate : /\{\{(.+?)\}\}/g,
        evaluate: /\{\%(.+?)\%\}/g
    },
    processContent: function(src) {
      return src.replace(/(^\s+|\s+$)/gm, '').replace(/\n+/gm, '');
    }
  },

  'home/template': {
    options: {
      processName: replaceTemplateName('home')
    },
    files: {
      ".grunt/home/template.js": ["src/home/template/**/*.html"]
    }
  },

  'home/app': {
    options: {
      root: 'global',
      processName: function(filepath){
        return 'home/app'
      }
    },
    files: {
      ".grunt/server/view/homeapp.js": ["src/home/index.html"]
    }
  }

}