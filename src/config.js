import {homedir} from "os"
import {argv} from "yargs"
import fs from 'mz/fs'
import JSON5 from 'json5'
import path from 'path'
import mkdirp from 'mkdirp'

let config = {};
let configReady = false;
let configError = null;

export default (key = null) => new Promise(async (resolve, reject) => {
  if (configError) return reject(configError);
  if (configReady) return resolve(config);
  try {
    const name = 'seashell-gateway';
    const datadir = argv.datadir ? argv.datadir : `${homedir()}/data/${name}`;
    const confPath = argv.conf ? argv.conf : `${datadir}/config.json`;
    const confContent = {
      /**
       * default configure
       */
    }
    
    try {
      const content = await fs.readFile(confPath, 'utf8')
      Object.assign(confContent, JSON5.parse(content))
    } catch (e) {
      console.log(e)
      mkdirp.sync(datadir)
      await fs.writeFile(confPath, JSON.stringify(confContent), 'utf8')
    }
    delete confContent.conf;
    config = {datadir, ...confContent, ...argv};
    
    console.log(config)

    configReady = true;
    resolve(config)
  } catch (e) {
    configError = e;
    reject(configError)
  }
})
