import {Router} from 'express'
import bodyParser from 'body-parser'

const router = Router();

router.use((req, res, next) => {
  const {location} = res.locals;
  if (location.type == 'SEASHELL') return next();
  return next('NOT_SEASHELL')
});

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(bodyParser.json({type: 'application/*+json'}));
router.use(bodyParser.json({type: 'text/html'}));
router.use(bodyParser.json({type: 'text/plain'}));

router.use(async (req, res, next) => {
  try {
    const {seashell, host, url, location} = res.locals;
    const reqBody = Object.assign({}, req.query, req.body, {
      __GATEWAY: {host, url},
      __METHOD: req.method
    });
    if (location.content == 'session') {
      reqBody.__SESSION = await seashell.request('/account/session', reqBody)
    }
    res.locals.seashellResult = await seashell.request(req.path, reqBody);
    next()
  } catch(e){
    next(e)
  }
});

router.use(require('./upload'));
router.use(require('./html'));


router.use((req, res, next) => {
  const {seashellResult} = res.locals;
  res.json(seashellResult.body)
});

router.use((err, req, res, next) => {
  if (err == 'NOT_SEASHELL') return next();
  if (!err) return next();
  if (typeof err == 'string') return res.json({error: err.toUpperCase()});
  if (typeof err == 'object') console.log(err.stack||err);
  res.json({error: 'EXCEPTION_ERROR'})
});


module.exports = router;