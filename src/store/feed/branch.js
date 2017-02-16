/**
 * 当前正在编辑(即世系)/预览(即文脉)的分支
 */

import { handleActions } from 'redux-actions'

const initialState = {
  // 正在加载节点列表
  statusLoadingNodes: true,
  statusLoadingBranch: true,


  // 分支所在的导航路径
  branchBreadcrumbs: [],
  // 世系/文脉的资源id
  branchId: '',
  // 世系/文脉对应的treeId
  treeId: '',
  // 标题
  branchName: '',
  // 世系/文脉的始迁祖id
  branchAncestorId: '',
  // 全部节点列表(索引)
  nodes: {},
  // 录入时, 落脚点所在的世代数
  classicalLevel: 0,
  // 录入时, 落脚点的id
  classicalSelectedNodeId: '',
  // 录入时, 上至始迁祖的所有落脚点直系祖先, 不包含落脚点及落脚点直系祖先的所有兄弟节点,
  // 下至后n代, 包括所有节点, 不包括n代以后的任何节点
  classicalRelatedNodesMap: {},
  // 录入时, 所有与落脚点同代的节点
  classicalSameLevelNodesMap: {},
  // 浏览时, 所有落脚点的直系祖先节点
  cultureNodes: [],
  // 浏览时的落脚点
  cultureSelectedId: '',


  collectionMap: {},
  showCollection: false


};

export default handleActions({

  /**
   * 初始化
   */
  BRANCH_INIT (state, action) {
    return Object.assign({}, initialState)
  },


  BRANCH_INFO_LOADING (state) {
    return Object.assign({}, state, {
      statusLoadingBranch: true,
      statusLoadingNodes: true
    })
  },

  /**
   * 分支信息(id, 始迁祖)更新
   */
  BRANCH_INFO_UPDATE (state, action) {
    return Object.assign({}, state, {
      statusLoadingBranch: false,
      branchId: action.branchId,
      branchName: action.branchName,
      branchBreadcrumbs: action.branchBreadcrumbs,
      branchAncestorId: action.branchAncestorId
    })
  },


  BRANCH_NODES_LOADING (state, action) {
    return Object.assign({}, state, {
      statusLoadingNodes: true
    })
  },

  /**
   * 节点列表(索引)加载
   */
  BRANCH_NODES_LOADED (state, action) {
    return Object.assign({}, state, {
      nodes: action.nodes,
      statusLoadingNodes: false
    })
  },


  /**
   * 与落脚点关联的节点更新
   */
  BRANCH_CLASSICAL_RELATED_UPDATE (state, action) {
    return Object.assign({}, state, {
      classicalSelectedNodeId: action.classicalSelectedNodeId,
      classicalRelatedNodesMap: action.classicalRelatedNodesMap
    })
  },


  /**
   * 某一代的所有节点更新
   */
  BRANCH_CLASSICAL_SAME_LEVEL_UPDATE (state, action) {
    return Object.assign({}, state, {
      classicalLevel: action.classicalLevel,
      classicalSameLevelNodesMap: action.classicalSameLevelNodesMap
    })
  },


  /**
   * 更新家庭树的落脚点及相关节点
   */
  BRANCH_FAMILY_LIST_UPDATE (state, action){
    return Object.assign({}, state, action.family)
  },


  /**
   * 祖先文脉节点更新
   */
  BRANCH_CULTURE_NODES_UPDATE (state, action) {
    return Object.assign({}, state, {
      cultureNodes: action.cultureNodes,
      cultureSelectedId: action.cultureSelectedId
    })
  },

  BRANCH_NAME_UPDATE (state, action) {
    return Object.assign({}, state, {
      branchName: action.name
    })
  },

  /**
   * 移动画布
   */
  MOVE_FAMILY_PAPER (state, action){
    return Object.assign({}, state, {
      transform: action.transform
    })
  },

  /**
   * 获取亲情树节点失败
   */
  GET_FAMILY_LIST_FAIL (state, action){
    return state
  },


  SELECT_FAMILY_PERSON (state, action){
    return Object.assign({}, state, {
      hasSelected: true,
      showTabName: 'info',
      lines: action.lines,
      updateTime: Date.now(),
      visibleTree: action.visibleTree,
      transform: action.transform,
      selected: state.tree[action.id]
    })
  },

  SWITCH_SELECTED_FAMILY_PERSON_TAB(state, action){
    return Object.assign({}, state, {
      showTabName: action.tabName
    })
  },

  ADD_FAMILY_PERSON(state, action){
    return Object.assign({}, state, {
      tree: action.tree,
      visibleTree: action.visibleTree,
      lines: action.lines,
      selected: action.selected,
      hasSelected: true,
      transform: action.transform,
      showTabName: 'info',
      updateTime: Date.now()
    })
  },

  FAMILY_PERSON_UPDATE (state, action) {
    return Object.assign({}, state, {
      tree: action.tree,
      visibleTree: action.visibleTree,
      lines: action.lines,
      selected: {},
      hasSelected: false,
      updateTime: Date.now()
    })
  },

  DELETE_FAMILY_PERSON (state, action){
    return Object.assign({}, state, {
      tree: action.tree,
      visibleTree: action.visibleTree,
      lines: action.lines,
      selected: {},
      hasSelected: false,
      updateTime: Date.now()
    })
  },


  CANCEL_SELECT_FAMILY_PERSON (state, action){
    return Object.assign({}, state, {
      selected: {},
      hasSelected: false
    })
  },


  /**
   * 更新收藏列表
   */
  BRANCH_COLLECTION_UPDATE (state, action) {
    return Object.assign({}, state, {
      collectionMap: action.collectionMap
    })
  },

  /**
   * 切换收藏列表显隐
   */
  BRANCH_COLLECTION_TOGGLE (state, action) {
    return Object.assign({}, state, {
      showCollection: action.showCollection
    })
  }


}, initialState)
