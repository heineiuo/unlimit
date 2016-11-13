/**
 * Copyright heineiuo
 */
import {Router} from 'seashell-client-node'

/**
 * create a common and express protocol router
 * @param models
 * @returns {*}
 */
const createRouter = (...models) => {
  const router = new Router();
  const modelKeys = {};
  models.map(model => {
    const current = modelKeys[model.modelName.toLowerCase()] = {
      keys: {}
    };
    Object.keys(model.statics).forEach(key => {
      current.keys[key.toLowerCase()] = model.statics[key]
    })
  });

  router.use('/:modelName/:action', async (req, res, next) => {
    try {
      const {modelName, action} = req.params;
      const lowerModelName = modelName.toLowerCase();
      const lowerAction = action.toLowerCase();
      if (!modelKeys.hasOwnProperty(lowerModelName)) return next();
      if (!modelKeys[lowerModelName].keys.hasOwnProperty(lowerAction)) return next();
      const result = await modelKeys[lowerModelName].keys[lowerAction](req.body, {req, res, next});
      return res.json(result);
    } catch(e){
      if (e == 'NOT_FOUND') return next();
      next(e)
    }
  });

  return router
};


export default module.exports = createRouter
