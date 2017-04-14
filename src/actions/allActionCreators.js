const allActionCreators = {
  account: {
    checkVerificationCode: require('./account/checkVerificationCode').default,
    createVerificationCode: require('./account/createVerificationCode').default,
    createAuthCode: require('./account/createAuthCode').default,
    createTokenByAuthCode: require('./account/createTokenByAuthCode').default,
    createTokenByVerificationCode: require('./account/createTokenByVerificationCode').default,
    logout: require('./account/logout').default,
    session: require('./account/session').default,
    list: require('./account/list').default
  },
  fs: {
    cat: require('./fs/cat').default,
    ls: require('./fs/ls').default,
    mkdir: require('./fs/mkdir').default,
    rename: require('./fs/rename').default,
    unlink: require('./fs/unlink').default,
    upload: require('./fs/upload').default,
    writeFile: require('./fs/writeFile').default,
  },
  drive: {
    batchLocations: require('./drive/batchLocation').default,
    commitLocations: require('./drive/commitLocations').default,
    getMeta: require('./drive/getMeta').default,
    editUsers: require('./drive/editUsers').default,
    getByHostname: require('./drive/getByHostname').default,
    list: require('./drive/list').default,
    create: require('./drive/create').default,
    permission: require('./drive/permission').default,
    unbindDomain: require('./drive/unbindDomain').default,
    bindDomain: require('./drive/bindDomain').default,
    remove: require('./drive/remove')
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