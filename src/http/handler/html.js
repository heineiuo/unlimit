import ent from 'ent'

/**
 * 返回html
 */

const handleHTML = (res, content) => {
  res.end(ent.decode(content))

};

export default handleHTML