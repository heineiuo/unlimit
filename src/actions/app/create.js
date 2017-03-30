import {connect, bindActionCreators} from 'action-creator'
import ShouldNotFound from './shouldNotFound'
import Joi from 'joi'

const create = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, Joi.object.keys({
    appName: Joi.string().required()
  }), {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const db = ctx.db.sub('app');
  const {appName} = validated.value;

  try {
    const app = {
      appName,
      permission: [],
      list: []
    };
    const {ShouldNotFound} = getAction();
    await ShouldNotFound({appName});
    await db.put(appName, app);
    resolve(app)
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    ShouldNotFound
  })
)(create)