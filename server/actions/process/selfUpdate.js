import npm from 'npm'
import pm2 from 'pm2'
import semver from 'semver'

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    npm.load(() => {
      npm.view('seashell@latest', (err, args) => {
        const latest = Object.values(args)[0]
        console.log(latest.version)
        console.log(semver.gt(latest.version, '0.1.1'))
      })
    })

  } catch(e){
    reject(e)
  }
})
