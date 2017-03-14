import Seashell from './seashell'

import {opendb, promisifydb, subdb} from '../utils/db'
import service from './service'
import account from './account'
import gateway from './gateway'


export default (db) => {
  const hub = new Seashell();

  hub.integrate(gateway('gateway', subdb(db, 'gateway')));
  hub.integrate(service('service', subdb(db, 'service')));
  hub.integrate(account('account', subdb(db, 'account')));

  return hub
}