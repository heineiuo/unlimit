const https = require('https')
const fs = require('fs')
const httpProxy = require('http-proxy')


const SNIContexts = {
  'git.youkuohao.com': {
    key: fs.readFileSync('/etc/letsencrypt/live/git.youkuohao.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/git.youkuohao.com/cert.pem', 'utf8')
  },

  'www.youkuohao.com': {
    key: fs.readFileSync('/etc/letsencrypt/live/www.youkuohao.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.youkuohao.com/cert.pem', 'utf8')
  }
}



const server = https.createServer(SNIContexts['www.youkuohao.com'], (req, res) => {

  httpProxy.createProxyServer({}).web(req, res, {
    target: 'http://127.0.0.1:3000',
    ssl: SNIContexts['git.youkuohao.com'],
    secure: true
  })

})


server.addContext('git.youkuohao.com', SNIContexts['git.youkuohao.com'])

server.listen(443)