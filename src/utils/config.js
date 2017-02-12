import os from 'os'
import fs from 'fs'
import {argv} from 'yargs'

const config = Object.assign({
  debug: false,
  datadir: `${os.homedir()}/data/gateway`
}, argv);

config.production = JSON.parse(fs.readFileSync(`${config.datadir}/production.json`, 'utf-8'));

// console.log(config);

export default config