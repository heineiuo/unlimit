

/**
 * get group detail
 * @returns {Promise}
 */
const detail = ({groupName}) => (ctx) => new Promise(async (resolve, reject) => {
  const db = ctx.db.group;

  try {
    const detail = await db.get(groupName);
    resolve(detail)
  } catch(e){
    if (e.name != 'NotFoundError') return reject(e);

    try {
      const detail = {
        appName: groupName,
        permission: [],
        list: []
      };
      await db.put(groupName, detail);
      resolve(detail)
    } catch(e){
      reject(e)
    }

  }
});

export default module.exports = detail