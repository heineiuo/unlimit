import {connect, bindActionCreators} from 'action-creator'
import unbindDomain from './unbindDomain'
import Joi from 'joi'

const destroy = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required()
    }));
    const db = ctx.db.sub('location');
    const {driveId} = validated.value;
    const {unbindDomain} = getAction();
    const drive = await db.get(driveId);
    await Promise.all(drive.hostnames.map(hostname => unbindDomain({hostname})));
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    unbindDomain
  })
)(destroy)