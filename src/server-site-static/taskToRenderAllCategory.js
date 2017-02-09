import Post from './model/post'
import Term from './model/term'
import Relation from './model/relation'
import renderCategory from './renderCategory'


const taskToRenderAllCategory = async () => {
  try {

    const terms = await Term.find({type: 'category'})
    const promises = terms.map(term=>{
      return new Promise(async (resolve, reject)=>{
        try {
          await renderCategory(term.term_id)
          resolve()
        } catch(e){
          reject(e)
        }
      })
    })

    await Promise.all(promises)
    console.log('success!')

  } catch(e){
    console.error(e.stack)
  }
}



export default taskToRenderAllCategory