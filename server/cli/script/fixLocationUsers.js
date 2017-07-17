import getConfig from '../src/config'
import getLevel from '../src/leveldb'
import union from 'lodash/union'


const fix = async () => {

  try {
    const config = await getConfig();
    const leveldb = await getLevel();

    const location = leveldb.collection('location');
    const waitToUpdate = []

    location.createReadStream()
      .on('data', async (item) => {
        const {key: driveId, value, value: {users, adminId}} = item;
        console.log(driveId);
        if (!users || users.length === 0) {
          waitToUpdate.push(location.put(driveId, Object.assign({}, value, {
            users: [config.production.adminId],
            adminId: config.production.adminId
          })))
        } else if (!adminId) {
          waitToUpdate.push(location.put(driveId, Object.assign({}, value, {
            users: union([config.production.adminId, ...users]),
            adminId: config.production.adminId
          })))
        } else if (users.findIndex(item => item === null) !== -1) {
          waitToUpdate.push(location.put(driveId, Object.assign({}, value, {
            users: users.filter(item => item !== null)
          })))
        } else {
          console.log(driveId, adminId, users.join(','))

        }
      })
      .on('end', async () => {
        console.log('end')
      })
      .on('close', async () => {
        console.log('close')
        try {
          console.log('正在写入数据');
          await Promise.all(waitToUpdate)
          console.log('success')
        } catch(e){
          console.log(e)
        }
      })
      .on('error', (e) => console.log(e))

  } catch(e){
    console.log(e)
  }

}


process.nextTick(fix)
