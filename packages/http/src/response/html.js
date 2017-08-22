import ent from "ent"

/**
 * 返回html
 */
const handleHTML = (req, res, content) => new Promise(resolve => {
  res.end(ent.decode(content))
  resolve()
})

export default handleHTML
