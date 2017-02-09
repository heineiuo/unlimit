import Term from './model/term'
import Post from './model/post'
import Setting from './model/setting'
import Relation from './model/relation'

const importCustomData = async () => {

  try {

    // await Relation.insert({
    //   "term_id": 1,
    //   "post_id": 8
    // })

    console.log('import custom data success')
  } catch(e){
    console.error(e.stack)
  }

}


importCustomData()
