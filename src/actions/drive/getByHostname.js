import {connect, bindActionCreators} from 'action-creator'
import bindDomain from './bindDomain'
import getDrive from './get'
import Joi from 'joi'

const getByHostname = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);
    const {hostname} = validated.value;
    const {bindDomain, getDrive} = getAction();
    const {driveId} = await bindDomain({hostname});
    const drive = await getDrive({driveId});
    resolve(drive)
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    bindDomain,
    getDrive
  })
)(getByHostname)