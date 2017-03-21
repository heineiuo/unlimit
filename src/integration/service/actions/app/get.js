
const Get = ({appId}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.app;
    const app = await db.get(appId);
    resolve(app)
  } catch(e){
    reject(new Error('App Not Found'))
  }
});

export default module.exports = Get;