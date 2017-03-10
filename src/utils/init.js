export default (hub, config) => new Promise(async(resolve, reject) => {
  try {


    console.log('[gateway] running init program...');

    const {gateway} = hub.integrations;
    const {domain} = config.production.init;

    const step1 = await gateway.request('gateway', {
      reducerName: 'host',
      action: 'Delete',
      hostname: domain
    });
    if (step1.body.error) throw new Error(step1.body.error);

    const step2 = await gateway.request('gateway', {
      reducerName: 'host',
      action: 'New',
      hostname: domain
    });
    if (step2.body.error) throw new Error(step2.body.error);


    const step3 = await gateway.request('gateway', {
      reducerName: 'location',
      action: 'commitLocations',
      hostname: domain,
      locations: [{
        "pathname": "/^/api/account.*$/",
        "cors": true,
        "type": "SEASHELL",
        "contentType": "TEXT",
        "content": "account"
      }, {
        "pathname": "/^/api/gateway.*$/",
        "cors": true,
        "type": "SEASHELL",
        "contentType": "TEXT",
        "content": "gateway"
      }, {
        "pathname": "/^/api/service.*$/",
        "cors": true,
        "type": "SEASHELL",
        "contentType": "TEXT",
        "content": "service"
      }]

    });
    if (step3.body.error) throw new Error(step3.body.error);

    const step4 = await gateway.request('gateway', {
      reducerName: 'file',
      action: 'mkdir',
      hostname: domain,
      pathname: '/',
    });

    const step5 = await gateway.request('gateway', {
      reducerName: 'file',
      action: 'mkdir',
      hostname: domain,
      pathname: '/public',
    });

    console.log('[gateway] init success');
    resolve()
  } catch (e) {
    console.log(e.stack);
    reject(e)
  }

})
