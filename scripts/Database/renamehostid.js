var Datastore = require('nedb-promise')

var Location = module.exports = new Datastore({
  filename: '../../data/Location.db',
  autoload: true
})

const start = async ()=>{
 try {
   const all = await Location.find({})
   await Promise.all(all.map(item=>{
     return Location.update({_id: item._id}, {$set: {
       host_id: item.hostId
     }}, {})
   }))
   console.log('success')
 } catch(e){
   next(e)
 }

}

start()