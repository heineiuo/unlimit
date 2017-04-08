import os from "os"
import {argv} from "yargs"

let config = {};
let configReady = false;
let configError = null;


const getConfig = (key = null) => new Promise(async (resolve, reject) => {
  if (configError) return reject(configError);
  if (configReady) return resolve(config);
  config = Object.assign({debug: false, datadir: `${os.homedir()}/data/gateway`}, argv);
  try {
    config.production = await import(`${config.datadir}/production.js`);
    configReady = true;
    resolve(config)
  } catch (e) {
    configError = e
  }
})

export default getConfig