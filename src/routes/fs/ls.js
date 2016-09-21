import fs from 'fs-promise'
import config from '../../utils/config'
import Host from '../../models/host'

module.exports = async (req, res, next) => {
  try {
    const {pathname, host_id} = req.body
    const {hostname} = await Host.findOne({_id: host_id})
    const prefix = `${config.datadir}/app/${hostname}`
    console.log(`${prefix}/${pathname}`)
    const ls = await fs.readdir(`${prefix}${pathname}`)
    res.json({
      ls
    })
  } catch(e){
    console.log(e.stack||e)
    next('ENOENT')
  }
}