import Mustache from 'mustache'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs-promise'
import mkdirp from 'mkdirp'
import loadWrapperTemplate from './loadWrapperTemplate'

import PostDetail from '../containers/PostDetail'

const renderPost = (post) => {
  return new Promise(async (resolve, reject)=>{
    try {
      const wrapperTemplate = await loadWrapperTemplate()

      const props = {
        homePath: '',
        staticPath: '/home',
        outputName: post.id,
        title: post.post_title,
        categoryTitle: '',
        categoryName: '',
        content: post.post_content
      }
      const postResult = Mustache.render(wrapperTemplate, {
        html: ReactDOMServer.renderToStaticMarkup(
          <PostDetail {...props}/>
        ),
        ...props
      })
      const dirPath = `${process.cwd()}/build/public/post/${props.outputName}`
      mkdirp.sync(dirPath)
      const filePath = `${dirPath}/index.html`
      await fs.writeFile(filePath, postResult, 'utf-8')
      resolve()
    } catch(e){
      reject(e)
    }
  })
}


export default renderPost