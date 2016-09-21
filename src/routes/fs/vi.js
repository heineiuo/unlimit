import fs from 'fs-promise'

module.exports = async (req, res, next) => {

  const {file, content} = req.body
  await fs.writeFile(file, contnet, 'utf-8')
  res.json({})

}