import version from './version'

export const actions = {
  '/': version['/'],
  account: require('./account').default,
  fs: require('./fs').default,
  drive: require('./drive').default,
  client: require('./client').default,
  socket: require('./session').default,
  version,
  topic: {
    create: require('./topic/create').default,
    edit: require('./topic/edit').default,
    get: require('./topic/get').default,
    render: require('./topic/render').default,
    list: require('./topic/list').default,
    remove: require('./topic/remove').default,
    editTags: require('./topic/editTags').default,
    editStatus: require('./topic/editStatus').default,
  },
  tags: {
    getDriveTags: require('./tags/getDriveTags').default
  },
  admin: {
    db: {
      ql:  require('./admin/ql').default,
      getCollectionNames: require('./admin/getCollectionNames').default
    }
  }
}
