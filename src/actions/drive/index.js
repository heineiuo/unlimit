export default {
  queryOne: require('./queryOne').default,
  queryMeta: require('./queryMeta').default,
  queryUsers: require('./queryUsers').default,
  queryOneByDomain: require('./queryOneByDomain').default,
  queryPermission: require('./queryPermission').default,
  mutateCreate: require('./mutateInsertOne').default,
  mutateDisableDrive: require('./mutateDisableDrive').default,
  mutateDomain: require('./mutateDomain').default,
  mutateInsertOne: require('./mutateInsertOne').default,
  mutateLocation: require('./mutateLocation').default,
  mutateUser: require('./mutateUser').default,
  mutateApproveDomain: require('./mutateApproveDomain').default,
  app: {
    querySession: require('./querySession').default,
    mutateInsertOne: require('./mutateInsertOne').default,
    remove: require('./mutateDeleteApp').default,
    queryApp: require('./queryApp').default,
    mutateCreateToken: require('./mutateCreateToken').default,
    find: require('./queryOneApp').default,
    removeItem: require('./mutateDeleteToken').default,
  }
}
