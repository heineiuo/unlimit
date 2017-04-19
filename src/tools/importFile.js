import getConfig from '../config'
import fs from 'fs-promise'
import getLeveldb from '../leveldb'
import filesystem from 'level-filesystem'
import readdirp from 'readdirp'
import path from 'path'

const run = async({driveId, localPath, force}) => {
  const config = await getConfig()
  const leveldb = await getLeveldb()
  const dbfs = filesystem(leveldb.sub('fs'))
  readdirp({root: localPath, entryType: 'both'})
    .on('data', async (entry) => {
      const targetParentDir = `/${driveId}/${entry.parentDir}`
      console.log('targetParentDir: ' + targetParentDir)
      if (entry.stat.isFile()) {
        console.log(targetParentDir+entry.name)
        const data = await fs.readFile(entry.fullPath);
        dbfs.writeFile(targetParentDir+entry.name, data, (err) => {
          if (err) return console.log(err)
        })
      } else {
        dbfs.mkdir(targetParentDir + entry.name, (err) => {
          // if (err) return console.log(err)
        })
      }
    })
}

process.nextTick(async () => {
  try {
    const config = await getConfig()
    const {driveId, localPath} = config;
    if (driveId && localPath) {
      await run({driveId, localPath, force: false})
    }
  } catch(e){
    console.error(e)
  }

})