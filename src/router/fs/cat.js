import fs from 'fs-promise'
import config from '../../util/config'

module.exports = async (req, res, next) => {
  const {host, filename} = req.body
  const prefix = `${config.datadir}/app/${host}`
  const cat = await fs.readFile(`${prefix}/${filename}`, 'utf-8')
  res.json({
    cat
  })
}