// curl -k https://localhost:8000/
const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/git.youkuohao.com/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/git.youkuohao.com/cert.pem', 'utf8')
}

https.createServer(options, (req, res) => {
  res.writeHead(200)
  res.end('hello https git\n')
}).listen(9441)

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('hello http git\n')
}).listen(9442)