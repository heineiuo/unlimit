import {POSTRawJSON} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'

/**
 * 添加host
 */
const createHost = (form) => async (dispatch, getState) => {
  try {
    const data = await POSTRawJSON(`${API_HOST}/seashell/drive/create`, {
      hostnames: [form.hostname],
      locations: []
    });
    if (data.error) throw new Error(data.error);
    dispatch({
      type: 'host__add',
      payload: {
        hostname: form.hostname
      }
    });

    dispatch(push(`/${form.driveId}`))
  } catch(e){
    console.log(`${e}${JSON.stringify(e.stack||{})}`)
  }
};

export default module.exports = createHost;