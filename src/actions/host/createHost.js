import {POSTRawJSON} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'

/**
 * 添加host
 */
const createHost = (form) => async (dispatch, getState) => {
  let data = null;
  try {
    data = await POSTRawJSON(`${API_HOST}/seashell/drive/create`, {
      hostnames: [form.hostname],
      locations: []
    });

  } catch(e){
    console.log(`${e}${JSON.stringify(e.stack||{})}`)
  }
  if (data.error) return console.log(data.error);

  dispatch({
    type: 'host__add',
    payload: {
      hostname: form.hostname
    }
  });

  dispatch(push(`/${form.driveId}`))
};

export default module.exports = createHost;