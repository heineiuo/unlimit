export default {
  account: require('./account').default,
  fs: require('./fs').default,
  drive: require('./drive').default,
  client: require('./client').default,
  socket: require('./session').default,
  process: require('./process').default,
  admin: {
    db: {
      ql:  require('./admin/ql').default,
      getCollectionNames: require('./admin/getCollectionNames').default
    }
  }
}
