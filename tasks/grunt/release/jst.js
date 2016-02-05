function replaceTemplateName(name){
  return function(filepath){
    return filepath.replace('src/'+name+'/template/','').replace('.html', '')
  }
}

module.exports = {

  'assetsHomeTemplate': {
    options: {
      templateSettings: {
        interpolate : /\{\{(.+?)\}\}/g,
        evaluate: /\{\%(.+?)\%\}/g
      },
      processContent: function(src) {
        return src.replace(/(^\s+|\s+$)/gm, '').replace(/\n+/gm, '');
      },
      processName: replaceTemplateName('home')
    },
    files: {
      ".grunt/home/template.js": ["src/home/template/**/*.html"]
    }
  }

}