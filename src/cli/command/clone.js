import fetch from 'node-fetch'
import Urlencode from 'form-urlencoded'
import queryGlobalConfig from '../queryGlobalConfig'
import {argv} from 'yargs'
import fs from 'fs-promise'
import path from 'path'
import {success, fail} from '../show'

export default () => new Promise(async (resolve, reject) => {
  try {
    const driveName = argv._[1]
    if (!driveName) return fail(
`
Error: Lost param: [drive name]
`
    )

    let ok = false
    try {
      await fs.stat(driveName)
    } catch(e){
      ok = true;
    }
    if (!ok) return console.log(
`
Error: Folder has exist!
`
    )

    const {token, API} = await queryGlobalConfig();
    const res = await fetch(`${API}/seashell/drive/queryOne?${Urlencode({
      name: driveName
    })}`, {
      method: "POST"
    })
    const json = await res.json();
    if (json.error) return console.log(json.error);
    const driveId = json._id;
    await fs.mkdir(driveName)
    await fs.writeFile(`${driveName}/.drivestore`, JSON.stringify({name: driveName, driveId}), 'utf8')
    success(
`
Success created a new folder named ${driveName}, please enter it. 
`
    )

    resolve()
  } catch(e){
    reject(e)
  }
})