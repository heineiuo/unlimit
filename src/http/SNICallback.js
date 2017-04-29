import fs from 'fs-promise'
import path from 'path'
import tls from 'tls'
import getConfig from '../config'
import getLevel from '../leveldb'

const ctxMap = {}

export default (servername, callback) => {
  process.nextTick(async () => {

    try {
      const {https: {approvedDomains}, datadir} = await getConfig();
      const pemdir = datadir + '/pem';
      console.log('servername: '+servername)
      console.log('pemdir: ' + pemdir)
      if (ctxMap[servername]) return callback(null, ctxMap[servername]);
      console.log('is approved: ' + approvedDomains.includes(servername))
      if (!approvedDomains.includes(servername)) return callback(new Error('Unapproved domain'));
      console.log('start create secure context..')
      const ctx = ctxMap[servername] = tls.createSecureContext({
        ca: await fs.readFileSync(`${pemdir}/${servername}/ca.pem`),
        key: await fs.readFileSync(`${pemdir}/${servername}/key.pem`),
        cert: await fs.readFileSync(`${pemdir}/${servername}/cert.pem`)
      })
      console.log(ctx);
      callback(null, ctx)
    } catch(e){
      console.log(e);
      callback(e)
    }

  })
}




