import getPost from './get'

export default (query) => async (dispatch, getCtx) =>{
  try {
    const post = await dispatch(getPost)(query)
    getCtx().render(post.html);
  } catch(e){
    getCtx().render('<div>500</div>');
  }
}
