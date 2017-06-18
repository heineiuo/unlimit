import Seashell from 'seashell'
import chalk from 'chalk'
import {createDispatch, seashellActionMiddleware} from 'action-creator'

import getConfig from './config'
import getLeveldb from './leveldb'
import createServer from './http'
import allActionCreators from './actions'

const start = async () => {
  try {

    const config = await getConfig();
    const leveldb = await getLeveldb();
    const server = await createServer(config.https);

    // const server = require('http').createServer();
    const app = new Seashell({server});

    app.use(async (ctx, next) => {
      ctx.leveldb = leveldb;
      ctx.config = config;
      ctx.json = (json) => {
        ctx.response.body = json;
        ctx.response.end();
      };
      ctx.setHeader = (header) => {
        Object.assign(ctx.response.headers, header);
      };
      ctx.error = (error) => ctx.json({error});
      ctx.on('error', (err) => {
        if (config.debug) console.error(chalk.red('[SEASHELL][INTEGRATE SERVICE] '+err.message + err.stack));
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

    app.use(seashellActionMiddleware(allActionCreators));

    server.run(app);

  } catch (e) {
    console.log('START FAIL\n'+e.stack||e);
    process.cwd(1);
  }
};

process.nextTick(start);
