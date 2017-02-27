import Seashell from 'seashell'

import {opendb, promisifydb, subdb} from '../utils/db'
import service from './service'
import account from './account'
import gateway from './gateway'


export default (db) => {
  const hub = new Seashell(db);

  hub.integrate({name: 'gateway', router: gateway(subdb(db, 'gateway'))});
  hub.integrate({name: 'service', router: service(subdb(db, 'service'), hub.handler)});
  hub.integrate({name: 'account', router: account(subdb(db, 'account'))});

  return hub
}