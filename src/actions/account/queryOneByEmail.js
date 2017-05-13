import Fetch from 'fetch-tools'
import {API_HOST} from '../../constants'

export default ({email, driveId}) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const result = await new Fetch(`${API_HOST}/seashell/account/queryOne`,{
    token, email
  }).post()
  if (result.error) return alert(result.error)
  // todo 将结果放到搜索框提示菜单
}
