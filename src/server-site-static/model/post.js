const Datastore = require('nedb-promise')

const Post = new Datastore({
  filename: `${process.cwd()}/build/data/post.db`,
  autoload: true
})


export default Post