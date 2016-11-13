import https from 'https'
import fs from 'fs-promise'

const getKeyPair = (host) => {
  const certdir = `${config.datadir}/app/${host}/cert`;
  return {
    key:  fs.readFileSync(`${certdir}/privkey.pem`, 'utf8'),
    cert: fs.readFileSync(`${certdir}/cert.pem`, 'utf8'),
    ca:   fs.readFileSync(`${certdir}/chain.pem`, 'utf8')
  }
};


const createHttpsServer = (config, app) => {
  try {
    const {approvedDomains} = config.https;

    if (approvedDomains.length > 0){
      const https_server = https.createServer(getKeyPair(approvedDomains[0]), app);
      approvedDomains.forEach((host, index) => {
        if (index > 0) https_server.addContext(host, getKeyPair(host))
      });
      https_server.listen(443, () => console.log('Listening on port 443'))
    }
  } catch(e){
    console.log(e.stack||e)
  }

};

export default module.exports = createHttpsServer