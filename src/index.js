import Seashell from 'seashell'
import chalk from 'chalk'
import {createDispatch, pathsToActions} from 'action-creator'

import getConfig from './config'
import getLeveldb from './leveldb'
import getMongodb from './mongodb'
import createServer from './http'
import allActionCreators from './actions'

const start = async () => {
  try {

    const config = await getConfig();
    const leveldb = await getLeveldb();
    const server = await createServer(config);

    // const server = require('http').createServer();
    const app = new Seashell({server});

    app.use(async (ctx, next) => {
      ctx.leveldb = leveldb;
      ctx.config = config;

      ctx.getLevel = getLeveldb;
      ctx.getLeveldb = getLeveldb;
      ctx.getConfig = getConfig;
      ctx.getMongodb = getMongodb;

      ctx.json = (json) => {
        ctx.response.body = json;
        ctx.response.end();
      };
      ctx.setHeader = (header) => {
        Object.assign(ctx.response.headers, header);
      };
      ctx.error = (error) => {
        ctx.json({
          error: error.name,
          message: error.message,
          details: error.details
        });
      }

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

      // const dispatch = createDispatch(ctx)
      // ctx.session = await dispatch(allActionCreators.account.session(ctx.request.body))
      const paths = ctx.request.headers.originUrl.split('/').filter(item => item !== '')
      
      pathsToActions(
        ctx,
        paths,
        allActionCreators,
        ctx.json,
        ctx.error,
        config
      )
    });

    server.run(app);

  } catch (e) {
    console.log('START FAIL\n'+e.stack||e);
    process.cwd(1);
  }
};

process.nextTick(start);
