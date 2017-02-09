import fs from 'fs'
import awaitify from './awaitify'


const getTemplate = async function(themeName, templateName){

  const template = {
    THEME_DIR: 'themes',
    post: 'post.html',
    category: 'category.html',
    archive: 'archive.html',
    index: 'index.html',
    special: 'special.html'
  }

  const filepath = [template.THEME_DIR, themeName, template[templateName]].join('/')
  return await awaitify(fs.readFile)(filepath, 'UTF-8')

}

export default getTemplate