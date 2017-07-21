import Joi from 'joi'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  title: Joi.string().required().min(1),
  content: Joi.object().required(),
  html: Joi.string().required().allow(''),
  driveId: Joi.string().required(),
  status: Joi.number(), // 0草稿，1发布，2下线
  drivePathname: Joi.string()
}), {allowUnknown: true});

/**
 * 创建一个post
 * 首先创建一个文件，再请求这个接口获取到topicId，再保持到文件里。
 * 下次打开的时候通过读取文件里的topicId打开内容
 * @param query
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);
    const {session} = getCtx().request.headers;
    const {title, content, driveId, html, drivePathname, status=0} = validated.value;
    // 检查该用户是否拥有该空间的权限
    const userId = session.userId || session.appId || session.id || session.Id;
    // const permission = await dispatch(checkDrivePermission({userId, driveId}));
    // if (permission.error) return reject(permission.error);
    const collection = getCtx().db.collection('post');
    const result = await collection.insertOne({
      title, content, html, driveId, drivePathname, createUserId: userId, status
    });
    resolve({...result, topicId: result._id})
  } catch(e){
    reject(e)
  }
});

