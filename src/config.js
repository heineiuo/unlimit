import {homedir} from "os"
import {argv} from "yargs"
import fs from 'fs-promise'
import json5 from 'json5'
import path from 'path'

let config = {};
let configReady = false;
let configError = null;

export default (key = null) => new Promise(async (resolve, reject) => {
  if (configError) return reject(configError);
  if (configReady) return resolve(config);
  try {
    const name = 'seashell-gateway';
    const datadir = argv.datadir ? argv.datadir : `${homedir()}/data/${name}`;
    const conf = argv.conf ? argv.conf : `${homedir()}/data/${name}/config.json`;
    const confContent = json5.parse(await fs.readFile(conf, 'utf8'));
    delete confContent.conf;
    config = {datadir, ...confContent, ...argv};
    configReady = true;
    resolve(config)
  } catch (e) {
    configError = e;
    reject(configError)
  }
})
