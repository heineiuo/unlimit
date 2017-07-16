export default {
  account: require('./account').default,
  fs: require('./fs').default,
  drive: require('./drive').default,
  app: require('./app').default,
  client: require('./client').default,
  socket: require('./socket').default,
  process: require('./process').default,
  admin: {
    db: {
      ql:  require('./admin/ql').default,
      getCollectionNames: require('./admin/getCollectionNames').default
    }
  }
}
