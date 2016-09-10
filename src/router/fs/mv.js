import fs from 'fs-promise'
import path from 'path'

module.exports = async (req, res, next) => {
  const {prevFile, nextFile} = req.body
  await fs.rename(prevFile, nextFile)
  res.json({})
}