import uuid from 'uuid'

const createUser = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.user;
    const id = uuid.v4();
    await db.put(id, Object.assign({}, query, {id}));
    resolve({id: id})
  } catch(e){
    reject(e)
  }
});

export default module.exports = createUser