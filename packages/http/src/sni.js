import letiny from 'letiny'
import { tmpdir, homedir } from 'os'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'
import tls from 'tls'

class SNI {
  constructor(options = {}) {
    this._approvedDomains = options.approvedDomains || []
    this._pemDir = options.pemDir || homedir()
    this._httpsEmail = options.httpsEmail || 'test@example.com'
  }

  _ctxMap = {}
  _approvedDomains = []
  _pemDir = homedir()
  _httpsEmail = 'test@example.com'
  _updateCtxMap = (servername, callback) => {
    fs.readFile(`${this._pemDir}/${servername}/pfx.pem`, (err, pfx) => {
      if (err) return callback(err)
      const ctx = this._ctxMap[servername] = tls.createSecureContext({ pfx })
      callback(null, ctx)
    })
  }

  callback = (servername, callback) => {
    if (this._ctxMap[servername]) return callback(null, this._ctxMap[servername])
    if (!this._approvedDomains.includes(servername)) {
      const error = new Error('Unapproved domain')
      error.name = 'ForbiddenError'
      return callback(error)
    }

    this._updateCtxMap(servername, callback)
  }

  update = ({ domain }) => new Promise(async (resolve, reject) => {
    // todo check rate limit
    mkdirp.sync(`${this._pemDir}/${domain}`)
    letiny.getCert({
      email: this._httpsEmail,
      domains: domain, //'example.com,www.example.com',
      webroot: `${tmpdir()}`,
      pfxFile: `${this._pemDir}/${domain}/pfx.pem`,
      certFile: `${this._pemDir}/${domain}/cert.pem`,
      caFile: `${this._pemDir}/${domain}/ca.pem`,
      privateKey: `${this._pemDir}/${domain}/key.pem`,
      accountKey: `${this._pemDir}/${domain}/account.pem`,
      agreeTerms: true
    }, (err) => {
      if (err) return reject(err)
      this._updateCtxMap(domain, (err1) => {
        if (err1) return reject(err1)
        return resolve({ error: null })
      })
    })
  })

  express = letiny.webrootChallengeMiddleware(tmpdir())

}

export default (options) => new SNI(options)
