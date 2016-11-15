/**
 * Copyright heineiuo <heineiuo@gmail.com>
 */

import level from 'levelup'
import config from '../utils/config'
const dbDir = `${config.datadir}/db`

export default module.exports = level(dbDir, {valueEncoding:'json'})
