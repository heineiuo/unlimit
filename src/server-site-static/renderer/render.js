import fs from 'fs'
import awaitify from './awaitify'
import assert from 'assert'
import mustache from 'mustache'
import getTemplate from './getTemplate'

import Category from '../model/Category'
import Post from '../models/Post'
import UpdateLog from '../model/UpdateLog'

/**
 * 渲染引擎
 * @param templateName
 * @param options
 */
const render = async function(templateName, options) {

  const isNewPost = false
  const rendered = mustache.render(getTemplate(themeName, templateName), options)

}


/**
 * 渲染分类
 * 先清空category目录, 再全部更新
 * @param categoryName
 * @returns {string}
 */
const renderCategory = async function(categoryName){
  if (isNewPost) return 'ok'

}

/**
 * 渲染存档
 */
const renderArchive = async function(){

}

/**
 * 渲染文章
 * 如果是新文章,同时会渲染archive和category
 * 如果是更新文章, 渲染category, 并且如果改了category,要渲染更新前后的两个category
 *
 * @param postId
 */
const renderPost = async function(postId){

  

}

/**
 * 渲染
 * @param pageId
 */
const renderSpecial = async function(pageId){

}

/**
 * 渲染首页
 */
const renderIndex = async function(pageId){

}

const renderAllPost = async function(){

}


const renderAllSpecial = async function(){

}

export {
  renderCategory,
  renderSpecial,
  renderPost,
  renderArchive,
  renderIndex,
  renderAllPost,
  renderAllSpecial
}