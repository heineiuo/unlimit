import {homedir} from "os"
import {argv} from "yargs"
import fs from 'fs-promise'
import json5 from 'json5'

let config = {};
let configReady = false;
let configError = null;


export default (key = null) => new Promise(async (resolve, reject) => {
  if (configError) return reject(configError);
  if (configReady) return resolve(config);
  config = Object.assign({debug: true, datadir: `${homedir()}/data/gateway`}, argv);
  try {
    config.production = json5.parse(await fs.readFile(`${config.datadir}/production.json`, 'utf8'));
    configReady = true;
    resolve(config)
  } catch (e) {
    configError = e;
    reject(configError)
  }
})