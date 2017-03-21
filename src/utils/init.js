import config from './config'

export default (hub) => new Promise(async(resolve, reject) => {
  try {


    console.log('[gateway] running init program...');

    const {gateway} = hub.integrations;
    const {domain} = config.production.init;

    const step1 = await gateway.request('gateway', {
      reducerName: 'host',
      action: 'Delete',
      hostname: domain
    });
    // if (step1.body.error) throw new Error(step1.body.error);

    const step2 = await gateway.request('gateway', {
      reducerName: 'host',
      action: 'New',
      hostname: domain
    });

    // if (step2.body.error) throw new Error(step2.body.error);

    const step3 = await gateway.request('gateway/location/commitLocations', {
      hostname: domain,
      locations: [{
        "pathname": "/api/*",
        "cors": true,
        "type": "SEASHELL",
        "content": "/api/"
      }]

    });
    // if (step3.body.error) throw new Error(step3.body.error);

    const step4 = await gateway.request('gateway/fs/mkdir', {
      hostname: domain,
      pathname: '/',
    });

    const step5 = await gateway.request('gateway/fs/mkdir', {
      hostname: domain,
      pathname: '/public',
    });

    console.log('[gateway] init success');
    resolve()
  } catch (e) {
    console.log('INIT FAIL \n' + e.stack||e);
    reject(e)
  }

})
