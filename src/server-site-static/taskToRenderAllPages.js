import Term from './model/term'
import renderPage from './renderPage'

const taskToRenderAllPages = async () => {
  try {

    const pages = await Term.find({type: 'page'})
    const promises = pages.map(page=>{
      return new Promise(async (resolve, reject)=>{
        try {

          await renderPage(page.term_id)
          resolve()

        } catch(e){
          reject(e)
        }
      })
    })

    await Promise.all(promises)
    console.log('render all page success!')

  } catch(e){
    console.error(e.stack)
  }
}



export default taskToRenderAllPages