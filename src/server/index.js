var path = require('path')
var crypto = require('crypto')
var fs = require('fs')
var tls = require('tls')
var net = require('net')

// node_modules
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var httpProxy = require('http-proxy')
var request = require('request')
var express = require('express')
var parse = require('url-parse')
var morgan = require('morgan')
var ent = require('ent')
var pem = require('pem')
var _ = require('lodash')

// database
var Datastore = require('nedb')
var db = {}
db.cname = new Datastore({
  filename: path.join(__dirname, './data/cname.db'),
  autoload: true
})
db.host = new Datastore({
  filename: path.join(__dirname, './data/host.db'),
  autoload: true
})

var doc = { hello: 'world'
  , n: 5
  , today: new Date()
  , nedbIsAwesome: true
  , notthere: null
  , notToBeSaved: undefined  // Will not be saved
  , fruits: [ 'apple', 'orange', 'pear' ]
  , infos: { name: 'nedb' }
};

db.host.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined

});


db.host.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
});

var controller = {}
var conf = {}
var app = require('express')()
var http = require('http').Server(app)

