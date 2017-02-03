import os from 'os'
import fs from 'fs'
import {argv} from 'yargs'

const getConfigFileContent = () => {
  const configpath = argv.configpath||`${process.cwd()}/config.json`;
  return JSON.parse(fs.readFileSync(configpath, 'utf-8'));
};

const configFileContent = getConfigFileContent();

const defaultConfig = {
  datadir: `${os.homedir()}/data/gateway`
};

const config = Object.assign({}, defaultConfig, configFileContent ,argv);

console.log(config);


export default config