import fs from 'fs-promise'
import path from 'path'
import tls from 'tls'
import getConfig from '../config'

export default (servername, callback) => {
  process.nextTick(async () => {

    try {
      const config = await getConfig();
      const {INSTALL_DIR} = config.https;
      const pathToKey = `${INSTALL_DIR}/${servername}/key.pem`
      const pathToCert = `${INSTALL_DIR}/${servername}/cert.pem`
      const pathToFullchain = `${INSTALL_DIR}/${servername}/fullchain.pem`

      const key = await fs.readFile(pathToKey);
      const cert = await fs.readFile(pathToCert);
      const fullchain = await fs.readFile(pathToFullchain);

      const secureCtx = tls.createSecureContext({
        key: key,
        cert: cert + fullchain,
        rejectUnauthorized: true,
        requestCert: false,
        ca: null,
        crl: null,
      })

      callback(null, secureCtx)

    } catch(e){
      callback(e)
    }

  })
}
