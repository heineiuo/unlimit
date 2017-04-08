const allActionCreators = {
  account: {
    getUserIdByEmail: require('./account/getUserIdByEmail'),
    checkVerificationCode: require('./account/checkVerificationCode'),
    createVerificationCode: require('./account/createVerificationCode'),
    createAuthCode: require('./account/createAuthCode'),
    createTokenByAuthCode: require('./account/createTokenByAuthCode'),
    createToken: require('./account/createToken'),
    createTokenByVerificationCode: require('./account/createTokenByVerificationCode'),
    logout: require('./account/logout'),
    session: require('./account/session'),
    createUser: require('./account/createUser'),
    getUser: require('./account/getUser'),
    list: require('./account/list')
  },
  fs: {
    cat: require('./fs/cat'),
    ls: require('./fs/ls'),
    mkdir: require('./fs/mkdir'),
    rename: require('./fs/rename'),
    unlink: require('./fs/unlink'),
    upload: require('./fs/upload'),
    writeFile: require('./fs/writeFile'),
  },
  drive: {
    batchLocations: require('./drive/batchLocation'),
    commitLocations: require('./drive/commitLocations'),
    getMeta: require('./drive/getMeta'),
    editUsers: require('./drive/editUsers'),
    getByHostname: require('./drive/getByHostname'),
    list: require('./drive/list'),
    create: require('./drive/create'),
    permission: require('./drive/permission'),
    unbindDomain: require('./drive/unbindDomain'),
    bindDomain: require('./drive/bindDomain'),
    remove: require('./drive/remove')
  },
  app: {
    create: require('./app/create'),
    remove: require('./app/remove'),
    get: require('./app/get'),
    list: require('./app/list'),
    addItem: require('./app/addItem'),
    find: require('./app/find'),
    removeItem: require('./app/removeItem'),
  },
  socket: {
    bind: require('./socket/bind'),
    unbind: require('./socket/unbind'),
    session: require('./socket/session'),
    emptyAll: require('./socket/empty'),
    findByAppId: require('./socket/findByAppId'),
  }
};

export default allActionCreators;