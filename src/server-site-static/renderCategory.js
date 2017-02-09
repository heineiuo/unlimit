import Mustache from 'mustache'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs-promise'
import mkdirp from 'mkdirp'
import loadWrapperTemplate from './loadWrapperTemplate'
import CategoryDetail from '../containers/CategoryDetail'
import Term from './model/term'
import Post from './model/post'
import Relation from './model/relation'

const renderCategory = (term_id, page=0) => {
  return new Promise(async (resolve, reject)=>{
    try {
      const wrapperTemplate = await loadWrapperTemplate()
      const category = await Term.findOne({term_id: term_id})
      const relations = await Relation.find({term_id: category.term_id})
      const posts = await Promise.all(relations.map(relation=>{
        return Post.findOne({id: relation.post_id})
      }))

      const post_list = posts.map(post=>{
        return {
          post_id: post.id,
          post_title: post.post_title,
          post_date: post.post_date
        }
      })

      const props = {
        homePath: '',
        staticPath: '/home',
        outputName: category.unique_name,
        title: category.title,
        categoryTitle: category.title,
        categoryName: category.unique_name,
        post_list: post_list
      }

      console.log(props)
      
      const staticOutput = Mustache.render(wrapperTemplate, {
        html: ReactDOMServer.renderToStaticMarkup(
          <CategoryDetail {...props}/>
        ),
        ...props
      })
      const dirPath = `${process.cwd()}/build/public/${props.outputName}`
      mkdirp.sync(dirPath)
      const filePath = `${dirPath}/index.html`
      await fs.writeFile(filePath, staticOutput, 'utf-8')
      resolve()
    } catch(e){
      reject(e)
    }
  })
}


export default renderCategory