import {connect, bindActionCreators} from '../../../tools'
import getGroup from '../group/get'

/**
 * 获取处理请求的app, 并作负载均衡
 */
const balance = ({importAppName}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const {importAppName} = query;
    const {getGroup} = getAction();
    const group = await getGroup({groupName: importAppName});
    const onlineItems = group.list.filter(service => service.status == 1);
    if (onlineItems.length == 0) return reject(new Error('TARGET_SERVICE_OFFLINE'));
    if (onlineItems.length == 1) return resolve(onlineItems[0].socketId);
    const ts = String(Date.now());
    const randomNumber = Number(ts[ts.length - 1]);
    const randomIndex = Math.floor(randomNumber * onlineItems.length / 10);
    return resolve(group[randomIndex].socketId)
  } catch(e){
    reject(e);
  }
});

export default module.exports = connect(
  bindActionCreators({
    getGroup
  })
)(balance)