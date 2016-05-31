var fs = require('fs')
var path = require("path")
var _ = require('lodash')
var gulp = require('gulp')
var webpack = require('webpack-stream')
var uglify = require("gulp-uglify")
var jsonomit = require('gulp-json-omit')
var nodeExternals = require('webpack-node-externals')
var insert = require('gulp-insert')
var cssmin = require('gulp-cssmin')
var sass = require('gulp-sass')
var imagemin = require('gulp-imagemin')
var imageminPngquant = require('imagemin-pngquant')
var filter = require('gulp-filter')
var htmlmin = require('gulp-htmlmin')
var concat = require('gulp-concat')
var jst = require('gulp-jst3')
var zip = require('gulp-zip')

var pkg = JSON.parse(fs.readFileSync('../package.json', 'utf-8'))


gulp.task('server', function() {

  return gulp.src('../src/index.js')
    .pipe(webpack({
      cache: false,
      target: 'node',
      externals: nodeExternals({
        whitelist: _.keys(JSON.parse(fs.readFileSync('../package.json')).devDependencies)
      }),
      output: {
        filename: "index.js"
      }
    }))
    .pipe(uglify())
    .pipe(insert.prepend('/*!\n * YKH HTTP Server \n */\n'))
    .pipe(gulp.dest('../build/server'))
})

gulp.task('server-copy', function () {
  return gulp.src('../package.json')
    .pipe(jsonomit(['../scripts','devDependencies']))
    .pipe(gulp.dest('../build/debug'))
})


/***********************-********************************************/

gulp.task('client-style', function () {
  return gulp.src('../client/style/index.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest('../build/debug/client/www/css'))
})

gulp.task('client-js', function () {
  return gulp.src('../client/index.js')
    .pipe(webpack({
      cache: false,
      target: 'web',
      output: {
        filename: "index.js"
      }
    }))
    .pipe(uglify())
    .pipe(insert.prepend('/*!\n * YKH HTTP Server \n */\n'))
    .pipe(gulp.dest('../build/debug/client/www/js'))
})

gulp.task('client-img', function () {
  return gulp.src('../client/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('../build/debug/client/www/images'))
    .pipe(filter('**/*.png', {restore: true}))
    .pipe(imageminPngquant({quality: '65-80', speed: 4})())
})

gulp.task('client-html', function () {
  return gulp.src('../client/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('../build/debug/client/www'))
})


gulp.task('client-template', function () {
  return gulp.src('../client/template/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(jst({
      interpolate : /\{\{(.+?)\}\}/g,
      evaluate: /\{\%(.+?)\%\}/g,
      ignorePath: path.join(process.cwd(), '../client/template')
    }))
    .pipe(concat('template.js'))
    .pipe(gulp.dest('../build/debug/client/www/js/'))
})

gulp.task('client-template-concat', ['client-template'], function () {
  return gulp.src('../build/debug/client/www/js/template.js')
    .pipe(webpack({
      cache: false,
      target: 'web',
      output: {
        filename: "template.js",
        library: "JST",
        libraryTarget: 'umd'
      }
    }))
    .pipe(uglify())
    .pipe(gulp.dest('../build/debug/client/www/js'))
})

gulp.task('client', [
  'client-style',
  'client-js',
  'client-html',
  'client-template-concat',
  'client-img'], function () {
  return gulp.src('../client/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('../build/debug/client/www/images'))
    .pipe(filter('**/*.png', {restore: true}))
    .pipe(imageminPngquant({quality: '65-80', speed: 4})())
})


gulp.task('client-fonts', function () {
  return gulp.src('../client/fonts/**/*')
    .pipe(gulp.dest('../build/debug/client/www/fonts'))
})

gulp.task('build', [
  'server',
  'server-copy',
  'client',
  'client-fonts'
])


gulp.task('zip', ['build'], function () {

  return gulp.src(['../build/**/*', '!../build/debug/data/**/*'])
    .pipe(zip(pkg.name+'-'+pkg.version+'.zip'))
    .pipe(gulp.dest('../build'))
})

gulp.task('default', ['zip'])