import fs from "fs-promise"
import path from "path"
import {argv} from "yargs"
import getStore from "../store"
import Fetch from "../fetch-tools"
import FormData from 'form-data'
import walk from "walk"
import {success, fail} from '../show'

const uploadFile = (parentId, validPath) => new Promise(async (resolve, reject) => {
  try {
    const {globalConfig: {API, token}, driveId, rootDir} = await getStore();
    const localPath = `${rootDir}${validPath}`

    const formData = new FormData()
    const filename = path.basename(localPath);
    const file = await fs.readFile(localPath)
    formData.append('file', file, {filename})

    const fileInfo = await Fetch(`${API}/seashell/fs/queryOneByFullPath`, {
      token, fullPath: `/${driveId}${validPath}`
    }).post()

    const {error, fileId} = fileInfo;
    const options = {driveId, fileId, token}
    if (error) {
      // 创建新文件
      delete options.fileId
      options.parentId = parentId || undefined
      options.name = filename
    }

    const res = await Fetch(`${API}/seashell/fs/mutateUpload`, options).formData(formData).post()
    if (res.error) return reject(new Error(res.error))
    success(`[ok] 同步文件 ${validPath}成功`)
    resolve()
  } catch (e) {
    fail(`[fail] 同步文件 ${validPath}失败`)
    reject(e)
  }
})

const updateFolder = (parentId, validPath) => new Promise(async (resolve, reject) => {
  try {
    const {globalConfig: {API, token}, driveId} = await getStore();
    const folderName = path.basename(validPath)

    let fileInfo = await Fetch(`${API}/seashell/fs/queryOneByFullPath`, {
      driveId, token, fullPath: `/${driveId}${validPath}`
    }).post()
    if (fileInfo.error) {
      const result = await Fetch(`${API}/seashell/fs/mutateInsertOne`, {
        driveId, token, parentId, name: folderName, type: 2
      }).post()
      if (result.error) return reject(new Error(result.error))
      fileInfo = result;
    }
    success(`[ok] 同步目录 ${validPath} 成功`)
    return resolve({...fileInfo, fileId: fileInfo._id})
  } catch (e) {
    fail(`[fail] 同步目录 ${validPath} 失败`)
    reject(e)
  }
})


export default () => new Promise(async (resolve, reject) => {
  try {
    const {rootDir, driveId, globalConfig} = await getStore();
    const fname = path.join(process.cwd(), argv._[1]);
    const stat = await fs.stat(fname);

    const allFiles = []
    const vpathFileId = {
      '/': null
    }

    const walkToPush = () => new Promise(async (resolve, reject) => {
      try {
        if (allFiles.length === 0) return resolve()
        const localPath = allFiles.shift()
        const stat = await fs.stat(localPath)
        const vpath = localPath.substring(rootDir.length)
        const parentDir = path.dirname(vpath);
        const parentId = vpathFileId[parentDir]
        if (stat.isFile()) {
          await uploadFile(parentId, vpath)
        } else {
          const {fileId} = await updateFolder(parentId, vpath)
          vpathFileId[vpath] = fileId
        }
        await walkToPush()
        resolve()
      } catch (e) {
        reject(e)
      }
    })

    const walkFullName = (fname) => {
      if (fname === rootDir) return false;
      allFiles.unshift(fname);
      walkFullName(path.dirname(fname))
    }

    walkFullName(fname)

    if (stat.isFile()) {
      await walkToPush()
      return resolve()
    }

    const walker = walk.walk(fname, {})

    walker.on("names", function (root, nodeNamesArray) {
      nodeNamesArray.forEach(item => {
        const rpath = path.join(root, item);
        const vpath = rpath.substring(rootDir);
        if (!allFiles.includes(vpath)) allFiles.push(vpath)
      })
    });

    walker.on("end", async () => {
      try {
        await walkToPush()
        resolve()
      } catch (e) {
        reject(e)
      }
    });

  } catch (e) {
    reject(e)
  }
})
