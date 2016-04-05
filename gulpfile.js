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
var pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))


gulp.task('server', function() {

  return gulp.src('server/index.js')
    .pipe(webpack({
      cache: false,
      target: 'node',
      externals: nodeExternals({
        whitelist: _.keys(JSON.parse(fs.readFileSync('package.json')).devDependencies)
      }),
      output: {
        filename: "index.js"
      }
    }))
    .pipe(uglify())
    .pipe(insert.prepend('/*!\n * YKH HTTP Server \n */\n'))
    .pipe(gulp.dest('build/debug'))
})

gulp.task('server-copy', function () {
  return gulp.src('package.json')
    .pipe(jsonomit(['scripts','devDependencies']))
    .pipe(gulp.dest('build/debug'))
})


gulp.task('client-www-style', function () {
  return gulp.src('client-www/style/index.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest('build/debug/client/www/css'))
})

gulp.task('client-www-js', function () {
  return gulp.src('client-www/index.js')
    .pipe(webpack({
      cache: false,
      target: 'web',
      output: {
        filename: "index.js"
      }
    }))
    .pipe(uglify())
    .pipe(insert.prepend('/*!\n * YKH HTTP Server \n */\n'))
    .pipe(gulp.dest('build/debug/client/www/js'))
})

gulp.task('client-www-img', function () {
  return gulp.src('client-www/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/debug/client/www/images'))
    .pipe(filter('**/*.png', {restore: true}))
    .pipe(imageminPngquant({quality: '65-80', speed: 4})())
})

gulp.task('client-www-html', function () {
  return gulp.src('client-www/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build/debug/client/www'))
})


gulp.task('client-www-template', function () {
  return gulp.src('client-www/template/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(jst({
      interpolate : /\{\{(.+?)\}\}/g,
      evaluate: /\{\%(.+?)\%\}/g,
      ignorePath: process.cwd()+'/client-www/template'
    }))
    .pipe(concat('template.js'))
    .pipe(gulp.dest('build/debug/client/www/js/'))
})

gulp.task('client-www-template-concat', ['client-www-template'], function () {
  return gulp.src('build/debug/client/www/js/template.js')
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
    .pipe(gulp.dest('build/debug/client/www/js'))
})

gulp.task('client-www', [
  'client-www-style',
  'client-www-js',
  'client-www-html',
  'client-www-template-concat',
  'client-www-img'], function () {
  return gulp.src('client-www/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/debug/client/www/images'))
    .pipe(filter('**/*.png', {restore: true}))
    .pipe(imageminPngquant({quality: '65-80', speed: 4})())
})


gulp.task('client-fonts', function () {
  return gulp.src('client-www/fonts/**/*')
    .pipe(gulp.dest('build/debug/client/www/fonts'))
})

gulp.task('build', [
  'server',
  'server-copy',
  'client-www',
  'client-fonts'
])


gulp.task('default', ['build'], function () {
  return gulp.src('build/debug/**/*')
    .pipe(zip(pkg.name+'-'+pkg.version+'.zip'))
    .pipe(gulp.dest('build/release'))
})