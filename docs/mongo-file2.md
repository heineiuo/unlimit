_id ObjectId
parentId ObjectId
name String
type Number
fullPath String


1. parse a path

/users/heineiuo/video/camera

findOne({fullPath: '/users/heineiuo/video/camera'})
// if has, ok
// if null:
  findOne({name: 'users', parentId: null})
  findOne({name: 'heineiuo', parentId: PREV_RESULT})
  findOne({name: 'video', parentId: PREV_RESULT})
  insertOne({fullPath: '/users/heineiuo/video/camera'})
  // ok
// if has more then one:
   result.forEach(/*像上面那样找到文件， 肯定只能匹配到一个, 返回匹配到的， 其他的递归获取父级的name，更新fullPath*/)


2. rename file or folder
// 方案一，需要更新所有子级的fullPath
// 方案二，drop掉所有子文件的索引，重新构建索引