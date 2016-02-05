
module.exports = {

  assets: {
    options: {
      encoding: 'utf8',
      algorithm: 'md5',
      length: 16,
      deleteOriginals: true,
      ignorePatterns: ['libs','bootstrap', 'jquery', 'lodash'],
      baseDir: 'build/Release/public'
    },
    files: [
      {
        src: ['build/Release/public/assets/home/index.html']
      }
    ]
  }

}