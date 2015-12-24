
// global variables
var db = {}


db.cname = new Datastore({
  filename: path.join(__dirname, './data/cname.db'),
  autoload: true
})
db.host = new Datastore({
  filename: path.join(__dirname, './data/host.db'),
  autoload: true
})
db.config = new Datastore({
  filename: path.join(__dirname, './data/config.db'),
  autoload: true
})


/**
 * doc insert demo
 */
//var doc = { hello: 'world'
//  , n: 5
//  , today: new Date()
//  , nedbIsAwesome: true
//  , notthere: null
//  , notToBeSaved: undefined  // Will not be saved
//  , fruits: [ 'apple', 'orange', 'pear' ]
//  , infos: { name: 'nedb' }
//};
//
//db.host.insert(doc, function (err, newDoc) {   // Callback is optional
//  // newDoc is the newly inserted document, including its _id
//  // newDoc has no key called notToBeSaved since its value was undefined
//
//});


