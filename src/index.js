import Seashell, {uuid} from '../../../git/seashell'
import chalk from 'chalk'
import level from 'levelup'
import levelSubLevel from 'level-sublevel'
import ql from 'q-level'
import {createDispatch} from 'action-creator'

import config from './config'
import init from './init'
import createServer from './http'

const makeSubLevels = (db, list) => {
  const collections = {
    sub: (subname) => {
      const lowerName = subname.toLowerCase();
      if (collections.hasOwnProperty(lowerName)) return collections[lowerName];
      return ql(db.sublevel(lowerName))
    }
  };
  list.forEach(name => {
    const lowerName = name.toLowerCase();
    if (['collection', 'sub'].indexOf(lowerName) > -1) {
      throw new Error('sublevel name could not be {sub, collection}');
    }
    collections[name] = collections[lowerName] = collections.sub(name)
  });

  collections.collection = collections.sub;

  return collections;
};

const start = async () => {

  try {

    const allActionCreators = {
      email: {
        getUserIdWithUpset: require('./actions/email/getUserIdWithUpset')
      },
      emailcode: {
        checkCode: require('./actions/emailcode/checkCode'),
        createLoginCode: require('./actions/emailcode/createLoginCode')
      },
      ssocode: {
        createCode: require('./actions/ssocode/createCode'),
        getSsoCode: require('./actions/ssocode/getSsoCode'),
        getTokenBySSOCode: require('./actions/ssocode/getTokenBySSOCode'),
        ssocodeGet: require('./actions/ssocode/ssocodeGet')
      },
      token: {
        createToken: require('./actions/token/createToken'),
        getTokenByEmailCode: require('./actions/token/getTokenByEmailCode'),
        logout: require('./actions/token/logout'),
        session: require('./actions/token/session')
      },
      user: {
        createUser: require('./actions/user/createUser'),
        getUser: require('./actions/user/getUser'),
        list: require('./actions/user/list')
      },
      fs: {
        cat: require('./actions/fs/cat'),
        ls: require('./actions/fs/ls'),
        mkdir: require('./actions/fs/mkdir'),
        rename: require('./actions/fs/rename'),
        unlink: require('./actions/fs/unlink'),
        upload: require('./actions/fs/upload'),
        writeFile: require('./actions/fs/writeFile'),
      },
      drive: {
        batchLocations: require('./actions/drive/batchLocation'),
        commitLocations: require('./actions/drive/commitLocations'),
        get: require('./actions/drive/get'),
        getByHostname: require('./actions/drive/getByHostname'),
        list: require('./actions/drive/list'),
        create: require('./actions/drive/create'),
        permission: require('./actions/drive/permission'),
        unbindDomain: require('./actions/drive/unbindDomain'),
        bindDomain: require('./actions/drive/bindDomain'),
        remove: require('./actions/drive/remove')
      },
      app: {
        create: require('./actions/app/create'),
        remove: require('./actions/app/remove'),
        get: require('./actions/app/get'),
        list: require('./actions/app/list'),
        addItem: require('./actions/app/addItem'),
        find: require('./actions/app/find'),
        removeItem: require('./actions/app/removeItem'),
      },
      socket: {
        bind: require('./actions/socket/bind'),
        unbind: require('./actions/socket/unbind'),
        session: require('./actions/socket/session'),
        emptyAll: require('./actions/socket/empty'),
        findByAppId: require('./actions/socket/findByAppId'),
      }
    };

    const db = levelSubLevel(level(`${config.datadir}/db`), {valueEncoding:'json'});
    const app = new Seashell();
    // app.__SEASHELL_NAME = 'gateway';

    const levels = makeSubLevels(db, Object.keys(allActionCreators));

    app.use((ctx, next) => {
      ctx.db = levels;
      ctx.json = (data) => {
        ctx.response.body = data;
        ctx.response.end()
      };
      ctx.setHeader = (header) => {
        Object.assign(ctx.response.headers, header);
      };
      ctx.error = (error) => ctx.json({error});
      ctx.on('error', (err) => {
        console.error(chalk.red('[SEASHELL][INTEGRATE SERVICE] '+err.message + err.stack));
        if (err.name === 'ValidationError') return ctx.error('PARAM_ILLEGAL');
        if (err.message === 'Command failed') return ctx.error('COMMAND_FAILED');
        return ctx.error(err.message);
      });
      ctx.on('end', () => {
        if (!ctx.state.isHandled) {
          ctx.response.body = {error: 'CAN_NOT_HANDLE_TIS_REQUEST'};
          ctx.response.end()
        }
      });
      next()
    });

    app.use('/account/session', async ctx => {
      if (ctx.request.headers.session) {
        ctx.json(ctx.request.headers.session)
      } else {
        ctx.error('NOT_LOGGED')
      }
    });

    app.use('/:moduleName/:actionName', async ctx => {
      const {moduleName, actionName} = ctx.request.params;
      if (!allActionCreators.hasOwnProperty(moduleName)) return ctx.error('NOT_FOUND');
      const actionCreators = allActionCreators[moduleName];
      if (!actionCreators.hasOwnProperty(actionName)) return ctx.error('NOT_FOUND');
      const dispatch = createDispatch(ctx);
      const actionType = dispatch(actionCreators[actionName])(ctx.request.body);
      if (actionType instanceof Promise) {
        const result = await actionType;
        ctx.json(result)
      } else {
        ctx.json({})
      }
    });

    if (config.init) await init(app);

    // start with https server or only start WebSocket server
    // also can be used standalone like `hub.io.listen(3443)`
    const server = createServer(config.production.https, app);
    app.io.attach(server);

  } catch(e){
    console.log('START FAIL\n'+e.stack||e);
    process.cwd(1);
  }
};

start();