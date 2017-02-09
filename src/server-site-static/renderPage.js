import Mustache from 'mustache'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs-promise'
import mkdirp from 'mkdirp'
import loadWrapperTemplate from './loadWrapperTemplate'
import Term from './model/term'
import Relation from './model/relation'
import Post from './model/post'

import PageDetail from '../containers/SpecialPage'

const renderPage = (term_id) => {
  return new Promise(async (resolve, reject)=>{
    try {
      const wrapperTemplate = await loadWrapperTemplate()

      const page = await Term.findOne({term_id: term_id})
      const relations = await Relation.find({term_id: page.term_id})
      const posts = await Promise.all(relations.map(relation=>{
        return Post.findOne({id: relation.post_id})
      }))

      const post_list = posts.map(post=>{
        return {
          post_id: post.id,
          post_title: post.post_title,
          post_date: post.post_date,
          post_content: post.post_content
        }
      })


      const props = {
        homePath: '',
        staticPath: '/home',
        outputName: page.unique_name,
        title: page.title || '',
        pageTitle: page.title,
        pageName: page.unique_name,
        post_list: post_list
      }
      const postResult = Mustache.render(wrapperTemplate, {
        html: ReactDOMServer.renderToStaticMarkup(
          <PageDetail {...props}/>
        ),
        ...props
      })
      const dirPath = `${process.cwd()}/build/public/${props.outputName}`
      mkdirp.sync(dirPath)
      const filePath = `${dirPath}/index.html`
      await fs.writeFile(filePath, postResult, 'utf-8')
      resolve()
    } catch(e){
      reject(e)
    }
  })
}


export default renderPage