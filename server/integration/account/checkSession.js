/**
 * Copyright YouKuoHao Inc.
 */

import User from './User'
import Token from './Token'

export default module.exports = async(req, res, next) => {
  res.session = {user: null};
  if (!req.body.hasOwnProperty('token')) return next();
  try {
    const token = await Token.get(req.body.token);
    res.session.user = await User.get(token.userId);
    next()
  } catch(e){
    if (e.name == 'NotFoundError') return next();
    console.log(e.stack||e.name||e);
    next()
  }
}
