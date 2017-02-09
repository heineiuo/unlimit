import Post from './model/post'
import renderPost from './renderPost'

const taskToRenderAllPosts = async () => {
  try {

    const posts = await Post.find({})
    const promises = posts.map(post=>{
      return new Promise(async (resolve, reject)=>{
        try {
          await renderPost(post)
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



export default taskToRenderAllPosts