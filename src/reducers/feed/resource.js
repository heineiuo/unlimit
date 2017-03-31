/**
 * Created by Administrator on 2016/8/15.
 */
import { handleActions } from 'redux-actions'


const initialState = {
  // 当前目录的详情
  currentFolder: {
    // currentFolder.breadcrumbs表示当前目录路径的导航, 如果是桌面、收藏、最近使用, 则为空数组
    //    最后一个item为当前所在的目录
    //    每个item的格式为 {resourceId: 'h1h1h1h', title: '文件夹1'}
    breadcrumbs: []
  },
  whereIsNow: 'desktop',
  // 当前所在目录的资源列表
  currentList: [],
  // 桌面的资源列表
  desktopList: [],
  // 收藏的资源列表
  favouriteList: [],
  // 最近使用的资源列表:
  latestList: []
};

export default handleActions({

  /**
   * 初始化
   */
  RESOURCE_INIT (state, action) {
    return Object.assign({}, initialState)
  },

  /**
   * 更新当前所在目录
   */
  RESOURCE_CURRENT_FOLDER_UPDATE (state, action) {
    return Object.assign({}, state, {
      whereIsNow: 'folder',
      currentFolder: action.currentFolder,
      currentList: action.currentList
    })
  },

  /**
   * 更新桌面
   */
  RESOURCE_DESKTOP_UPDATE (state, action) {
    return Object.assign({}, state, {
      whereIsNow: 'desktop',
      desktopList: action.desktopList
    })
  },

  /**
   * 更新`最近使用`
   */
  RESOURCE_LATEST_UPDATE (state, action) {
    return Object.assign({}, state, {
      whereIsNow: 'latest',
      latestList: action.latestList
    })
  },

  /**
   * 更新`收藏`
   */
  RESOURCE_FAVOURITE_UPDATE (state, action) {
    return Object.assign({}, state, {
      whereIsNow: 'favourite',
      favouriteList: action.favouriteList
    })
  }

}, initialState)
