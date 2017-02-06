import {combineReducers} from 'sprucejs'

export default (db, initdata) => new Promise(async (resolve, reject) => {
  try {

    const {domain} = initdata;

    const handler = combineReducers([
      require('../integration/gateway/host'),
      require('../integration/gateway/Location')
    ])(db);


    try {
      await handler({
        reducerName: 'host',
        action: 'Delete',
        hostname: domain
      });
    } catch(e){
      console.log(e.stack)
    }


    await handler({
      reducerName: 'host',
      action: 'New',
      hostname: domain
    });


    await handler({
      reducerName: 'location',
      action: 'New',
      hostname: domain,
      pathname:'/^.*$/',
      cors: true,
      sort: 1,
      type: 'SEASHELL',
      contentType: 'TEXT',
      content: ''
    });

    resolve()
  } catch(e){
    reject(e)
  }
})