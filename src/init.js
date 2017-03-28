import config from './config'

export default (app) => new Promise(async(resolve, reject) => {
  try {

    console.log('[gateway] running init program...');

    const {domain} = config.production.init;

    console.log(2, (await app.requestSelf({
      headers: {
        originUrl: '/drive/remove',
      },
      body: {hostname: domain}
    })).body.error);

    console.log(3, (await app.requestSelf({
      headers: {originUrl: '/drive/create'},
      body: {
        hostname: domain,
        locations: [{
          "pathname": "/api/*",
          "cors": true,
          "type": "SEASHELL",
          "content": "/api/"
        }]
      }
    })).body.error);

    console.log(4, (await app.requestSelf({
      headers: {originUrl: '/fs/mkdir'},
      body: {
        hostname: domain,
        pathname: '/',
      }
    })).body.error);

    console.log(5, (await app.requestSelf({
      headers: {
        originUrl: '/fs/mkdir',
      },
      body: {
        hostname: domain,
        pathname: '/public',
      }
    })).body.error);

    console.log('[gateway] init success');
    resolve()
  } catch (e) {
    console.log('INIT FAIL \n' + e.stack||e);
    reject(e)
  }

})
