/**
 * @private
 * an aggregate result
 */

export default ({driveId}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const {db} = getCtx();
    const postDb = db.collection('post')
    const results = await postDb.mapReduce(function(){
      this.tags.split(',').forEach(item => {
        emit(item, 1)
      })
    }, function(key, values) {
      return Array.sum(values)
    }, {
      query: {tags: {$type: 'string'}, driveId},
      out: {inline: 1}
    })
    const list = results.map(item => {
      return {tag: item._id, value: item.value}
    });
    const tags = db.collection('tags');
    await tags.findOneAndReplace({driveId}, {driveId, list, time: Date.now()}, {upsert: true})
    resolve({list})
  } catch(e){
     if (e.name === `ns doesn't exist`) {
      return resolve({list: []})
    }
    reject(e)
  }
})


