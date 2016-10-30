/**
 * Copyright heineiuo
 */
import {Router} from 'seashell-client-node'

/**
 * create a seashell and express protocol router
 * @param model
 * @returns {*}
 */
const createRouter = (model) => {
  const router = new Router();
  const keys = Object.keys(model.statics);

  router.use(`/${model.modelName}/:action`, async (req, res, next) => {
    try {
      const {action} = req.params;
      if (keys.indexOf(action) == -1) return res.error('NOT_FOUND');
      const result = await model.statics[action](req.body, {req: req, res: res, next: next});
      return res.json(result);
    } catch(e){
      next(e)
    }
  });

  return router
};


export default module.exports = createRouter
