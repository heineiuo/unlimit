import {POSTRawJSON} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'

/**
 * 更新我的app列表
 */
const getHostList = (currentHostname=null) => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'host__stateUpdate',
      payload: {
        hostListState: 1,
      }
    });

    const {token} = getState().account;
    const hostListResult = await POSTRawJSON(`${API_HOST}/seashell/drive/list`,{
      limit: 0, token
    });

    if (hostListResult.error) throw new Error(hostListResult.error);

    if (hostListResult.list.length === 0) {
      // todo
      throw new Error('空间数量为零！')

    } else {
      const hostDefault = hostListResult.list[0].hostname;

      if (currentHostname) {
        const currentHostnameIndex = hostListResult.list.findIndex(item => {
          return item.hostname === currentHostname
        });
        if (currentHostnameIndex) {

          return dispatch({
            type: "host__listUpdate",
            payload: {
              hostList: hostListResult.list,
              hostDefault,
              hostname: currentHostname
            }
          });
        }
      }

      dispatch({
        type: "host__listUpdate",
        payload: {
          hostList: hostListResult.list,
          hostDefault,
          hostname: hostDefault,
        }
      });
    }

  } catch(e){
    alert(e.message);
    console.log(e.stack)
  }
};


export default module.exports = getHostList;