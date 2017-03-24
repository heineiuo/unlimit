import {connect, bindActionCreators} from 'action-creator'
import ShouldNotFound from './shouldNotFound'

const create = ({appName}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  const db = ctx.db.app;

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