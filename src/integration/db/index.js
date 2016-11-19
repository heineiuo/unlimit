import Router from '../../router'
import config from '../../utils/config'
import {Model, createRouter} from '../../spruce'

const app = new Router();

app.use((req, res, next) => {
  res.app = app;
  res.json = (data) => {
    res.body = data;
    res.end()
  };
  next()
});

app.use(async (req, res, next) => {
  const {modelName} = req.body;

});


app.use((req, res, next) => {
  res.json({error: 'NOT_FOUND'})
});


export default module.exports = app
