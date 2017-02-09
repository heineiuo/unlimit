import Mustache from 'mustache'
import React from 'react'
import fs from 'fs-promise'
import path from 'path'
import {minify} from 'html-minifier'

const loadWrapperTemplate = () => {
  return new Promise(async (resolve, reject)=>{
    try {
      const wrapperTemplate = minify(
        await fs.readFile(path.join(process.cwd(), './default/entry/static.html'), 'utf-8')
        , {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          ignoreCustomComments: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
          removeComments: true
        })

      Mustache.parse(wrapperTemplate)
      resolve(wrapperTemplate)
    } catch(e){
      reject(e)
    }

  })
}

export default loadWrapperTemplate