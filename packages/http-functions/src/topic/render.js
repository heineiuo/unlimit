import getPost from './get'

export default (query) => async (dispatch, getState) =>{
  try {
    const post = await dispatch(getPost)(query)
    getState().render(post.html);
  } catch(e){
    getState().render('<div>500</div>');
  }
}
