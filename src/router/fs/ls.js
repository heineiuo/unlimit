import fs from 'fs-promise'
import config from '../../util/config'

export default async (req, res, next) => {
  try {
    const {pathname} = req.body
    const {host} = req.body.__GATEWAY
    const prefix = `${config.datadir}/app/${host.hostname}`
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