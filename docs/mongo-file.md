key      |    _id      |  parentId | isDirectory 

pathname  | extname  driveId |  tags |  content

valueType |   ObjectId   |ObjectId | Boolean     

String   |String  | ObjectId  Array | Object

### Create
```
{
  isDirectory,
  ...
}

```


### Move
```
{
  parentId: nextParentId,
  pathname: nextPathname
}
```

### Get full pathname
```
  pathname + . + extname
```
