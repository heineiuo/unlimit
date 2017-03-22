import path from 'path'
import filesystem from 'level-filesystem'


const upload = ({hostname, pathname, isHashName=true}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const isPublic = pathname.search('/public') == 0;
    req.setHeader({
      __UPLOAD: true
    });
    resolve({
      uploadDir: `${hostname}${pathname}`,
      isPublic,
      isHashName,
      pathname,
      hostname,
      uploadLocation: `//${hostname}${pathname}`
    })
  } catch(e){
    console.log('UPLOAD FAIL \n'+e.stack);
    reject(e)
  }
});

export default module.exports = upload;