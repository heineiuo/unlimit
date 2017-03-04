
export default (hub, config) => new Promise(async(resolve, reject) => {
  try {


    console.log('[gateway] running init program...');

    const {gateway} = hub.integrations;
    const {domain} = config.production.init;

    await gateway.request('gateway', {
      reducerName: 'host',
      action: 'Delete',
      hostname: domain
    });


    await gateway.request('gateway', {
      reducerName: 'host',
      action: 'New',
      hostname: domain
    });


    await gateway.request('gateway',{
      reducerName: 'location',
      action: 'New',
      hostname: domain,
      pathname:'/^\/api\/account.*$/',
      cors: true,
      sort: 1,
      type: 'SEASHELL',
      contentType: 'TEXT',
      content: 'account'
    });

    await gateway.request('gateway',{
      reducerName: 'location',
      action: 'New',
      hostname: domain,
      pathname:'/^\/api\/gateway.*$/',
      cors: true,
      sort: 1,
      type: 'SEASHELL',
      contentType: 'TEXT',
      content: 'gateway'
    });

    await gateway.request('gateway',{
      reducerName: 'location',
      action: 'New',
      hostname: domain,
      pathname:'/^\/api\/service.*$/',
      cors: true,
      sort: 1,
      type: 'SEASHELL',
      contentType: 'TEXT',
      content: 'service'
    });

    await gateway.request('gateway', {
      reducerName: 'file',
      action: 'mkdir',
      hostname: domain,
      pathname:'/',
    });

    await gateway.request('gateway',{
      reducerName: 'file',
      action: 'mkdir',
      hostname: domain,
      pathname:'/public',
    });

    console.log('[gateway] init success');
    resolve()
  } catch(e){
    console.log(e.stack);
    reject(e)
  }

})
