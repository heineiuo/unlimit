
/**
 * get app list
 * @returns {Promise}
 */
const list = ({limit=20}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.sub('app');
    const list = [];
    db.createReadStream({limit:null})
      .on('data', (data) => {
        list.push(data)
      })
      .on('error', (e) => {
        console.log(e)
      })
      .on('end', () => {
        resolve({list})
      });
  } catch(e){
    reject(e)
  }
});

export default module.exports = list;