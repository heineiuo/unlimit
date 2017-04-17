const allActionCreators = {
  account: {
    mutateCreateVerificationCode: require('./account/mutateCreateVerificationCode').default,
    mutateCreateAuthCode: require('./account/mutateCreateAuthCode').default,
    mutateCreateToken: require('./account/mutateCreateToken').default,
    mutateDeleteToken: require('./account/mutateDeleteToken').default,
    session: require('./account/session').default,
    queryOne: require('./account/queryOne').default,
    queryAll: require('./account/queryAll').default
  },
  fs: {
    queryFileContent: require('./fs/queryFileContent').default,
    queryOneByFullPath: require('./fs/queryOneByFullPath').default,
    queryOneById: require('./fs/queryOneById').default,
    queryFile: require('./fs/queryFile').default,
    mutateInsertOne: require('./fs/mutateInsertOne').default,
    mutateUpload: require('./fs/mutateUpload').default,
    mutateDelete: require('./fs/mutateDelete').default,
    mutateFileContent: require('./fs/mutateFileContent').default,
  },
  drive: {
    queryOne: require('./drive/queryOne').default,
    queryMeta: require('./drive/queryMeta').default,
    queryUsers: require('./drive/queryUsers').default,
    queryOneByDomain: require('./drive/queryOneByDomain').default,
    queryPermission: require('./drive/queryPermission').default,
    mutateCreate: require('./drive/mutateInsertOne').default,
    mutateDisableDrive: require('./drive/mutateDisableDrive').default,
    mutateDomain: require('./drive/mutateDomain').default,
    mutateInsertOne: require('./drive/mutateInsertOne').default,
    mutateLocation: require('./drive/mutateLocation').default,
    mutateUser: require('./drive/mutateUser').default,
  },
  app: {
    create: require('./app/create').default,
    remove: require('./app/remove').default,
    get: require('./app/get').default,
    list: require('./app/list').default,
    addItem: require('./app/addItem').default,
    find: require('./app/find').default,
    removeItem: require('./app/removeItem').default,
  },
  socket: {
    bind: require('./socket/bind').default,
    unbind: require('./socket/unbind').default,
    session: require('./socket/session').default,
    emptyAll: require('./socket/empty').default,
    findByAppId: require('./socket/findByAppId').default,
  }
};

export default allActionCreators;