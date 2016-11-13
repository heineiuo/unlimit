import createIO, {createIOMiddleware} from './hub'
import createApp, {httpStart} from './http'
import http from 'http'
import config from './utils/config'

const start = async () => {

  try {

    if (config.http) {
      const app = createApp(config);
      const IOMiddleware = await createIOMiddleware(config);
      app.use(IOMiddleware);
      return httpStart(config, http.createServer(app));
    }

    const io = createIO(config);
    io.listen(config.port);

  } catch(e){
    console.log(e.stack||e);
    process.cwd(1);
  }
};

start();
