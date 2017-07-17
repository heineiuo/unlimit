## Db

```javascript
const db = new Db({

})

```

## Collection 

```js
const userDb = db.collection('user')
```

### collection.find  [=> cursor]

```js
userDb.find({}) 
```

### collection.findOne  [=> cursor]

```js
```

## Cursor

* Supported operators: `$in`, `$nin`, `$exists`, `$gte`, `$gt`, `$lte`, `$lt`, `$eq`, `$ne`, `$mod`, `$all`, `$and`, `$or`, `$nor`, `$not`, `$size`, `$type`, `$regex`, `$where`, `$elemMatch`

```js
const cursor = userDb.find({age: {$gte: 20}})
const data = await cursor.toArray()
```

