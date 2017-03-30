
const list = ({limit=20}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.sub('socket');
    const list = [];
    db.createReadStream({limit})
      .on('data', (data) => {
        list.push(data)
      })
      .on('end', () => {
        resolve({list})
      });
  } catch(e){
    reject(e)
  }
});

export default module.exports = list