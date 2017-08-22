import letiny from 'letiny'
import Joi from 'joi'
import {tmpdir} from 'os'
import mkdirp from 'mkdirp'
import path from 'path'

const ctxMap = {}

export const SNICallback = (servername, callback) => {
  const { HTTPS_APPROVED_DOMAINS, DATA_DIR } = process.env
  if (ctxMap[servername]) return callback(null, ctxMap[servername])
  if (!HTTPS_APPROVED_DOMAINS.includes(servername)) {
    const error = new Error('Unapproved domain')
    error.name = 'ForbiddenError'
    return callback(error)
  }

  const pemdir = path.resolve(DATA_DIR, './pem')
  fs.readFile(`${pemdir}/${servername}/pfx.pem`, (err, pfx) => {
    if (err) {
      console.log(err)
      return callback(err)
    }
    const ctx = ctxMap[servername] = tls.createSecureContext({pfx})
    callback(null, ctx)
  })
}

export const updateCert = ({domain}) => new Promise(async (resolve, reject) => {
  const {HTTPS_EMAIL, DATA_DIR} = process.env
  
  // todo check rate limit
  const pemdir = path.resolve(DATA_DIR, './pem')
  mkdirp.sync(`${pemdir}/${domain}`)
  letiny.getCert({
    email: HTTPS_EMAIL,
    domains: domain, //'example.com,www.example.com',
    webroot: `${tmpdir()}`,
    pfxFile: `${pemdir}/${domain}/pfx.pem`,
    certFile: `${pemdir}/${domain}/cert.pem`,
    caFile: `${pemdir}/${domain}/ca.pem`,
    privateKey: `${pemdir}/${domain}/key.pem`,
    accountKey: `${pemdir}/${domain}/account.pem`,
    agreeTerms: true
  }, (err) => {
    if (err) return reject(err)
    return resolve({error: null})
  })

})
