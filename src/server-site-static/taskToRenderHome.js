import Mustache from 'mustache'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs-promise'
import mkdirp from 'mkdirp'

import Home from '../containers/Home'
import loadWrapperTemplate from './loadWrapperTemplate'


const taskToRenderHome = async () => {

  try {

    const wrapperTemplate = await loadWrapperTemplate()

    const props = {
      homePath: '',
      staticPath: '/home',
      outputName: '',
      title: '绿豪园艺'
    }

    const result = Mustache.render(wrapperTemplate, {
      html: ReactDOMServer.renderToStaticMarkup(
        <Home {...props}/>
      ),
      ...props
    })

    const dirPath = `${process.cwd()}/build/public`
    const filePath = `${dirPath}/index.html`
    mkdirp.sync(dirPath)
    await fs.writeFile(filePath, result, 'utf-8')
    console.log('render home success!')

  } catch(e){
    console.error(e.stack)
  }
}

export default taskToRenderHome