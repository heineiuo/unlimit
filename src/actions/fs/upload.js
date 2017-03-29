import path from 'path'
import filesystem from 'level-filesystem'


const upload = ({driveId, pathname, isHashName=true}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const isPublic = pathname.search('/public') == 0;
    req.setHeader({
      __UPLOAD: true
    });
    let hostname = null;
    try {
      hostname = (await ctx.db.sub('location').get(driveId)).hostnames[0];
    } catch(e){}
    resolve({
      uploadDir: `${driveId}${pathname}`,
      isPublic,
      isHashName,
      pathname,
      driveId,
      uploadLocation: hostname?`//${hostname}${pathname}`:null
    })
  } catch(e){
    console.log('UPLOAD FAIL \n'+e.stack);
    reject(e)
  }
});

export default module.exports = upload;