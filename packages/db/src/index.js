import Seashell from 'seashell'
import chalk from 'chalk'
import {createDispatch, pathsToActions} from 'action-creator'
import dotenv from 'dotenv'
import shell from 'shelljs'
import {homedir} from 'os'
import path from 'path'
import fs from 'fs'
import {Db} from '../../db/src'
import createServer from '../../http/src'
import allActionCreators from './actions'

const { NODE_ENV='development'} = process.env

if (NODE_ENV === 'development') {
  const dataDir = path.resolve(process.cwd(), './.unlimit')
  const envPath = path.resolve(dataDir, './.env')
  if (dotenv.config({path: envPath}).error) {
    const defaultEnv = `# unlimit
DATA_DIR = ${dataDir}`
    shell.exec(`mkdir -p ${dataDir}`)
    fs.writeFileSync(envPath, defaultEnv, 'utf8')
    dotenv.config({path: envPath})
  }
}

const {
  DATA_DIR
} = process.env

const start = async () => {
  try {

    const db = new Db({
      presets: [],
      dbpath: path.resolve(DATA_DIR, './db'),
      keyEncoding: 'utf8',
      valueEncoding: 'json'
    });

    const server = createServer();

    // const server = require('http').createServer();
    const app = new Seashell({server});
    
    app.use(async (ctx, next) => {
      ctx.db = db;

      ctx.log = (...args) => console.log(...args)

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
          errors: error.details || []
        });
      }

      ctx.on('error', (err) => {
        if (!(process.env.NODE_ENV === 'production')) console.error(chalk.red('[SEASHELL][INTEGRATE SERVICE] '+err.message + err.stack));
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
        ctx.error
      )
    });

    server.run(app);

  } catch (e) {
    console.log('START FAIL\n'+e.stack||e);
    process.cwd(1);
  }
};

process.nextTick(start);
