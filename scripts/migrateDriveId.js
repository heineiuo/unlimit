import getConfig from '../src/config'
import getLevel from '../src/leveldb'
import union from 'lodash/union'
import filesystem from 'level-filesystem'

process.nextTick(async () => {
  const config = await getConfig()
  const leveldb = await getLevel()

  const {prevDriveId, nextDriveId} = config;
  const fs = filesystem(leveldb.sub('fs'));
  fs.rename(prevDriveId, nextDriveId, (err) => {
    if (err) return console.log(err)
    console.log('success')
  })
})