import Fetch from '@shared/fetch'

export const apimap = {
  session: '/seashell/account/session',
  mutateCreateAuthCode: '/seashell/account/mutateCreateAuthCode',
  mutateCreateToken: '/seashell/account/mutateCreateToken',
  mutateDeleteToken: '/seashell/account/mutateDeleteToken',
  accountQueryOne: '/seashell/account/queryOne',
  mutateCreateVerificationCode: '/seashell/account/mutateCreateVerificationCode',
  driveInsertOne: '/seashell/drive/mutateInsertOne',
  driveRemove: '/seashell/drive/remove',
  driveMutateLocation: '/seashell/drive/mutateLocation',
  driveMudateUser: '/seashell/drive/mutateUser',
  driveMeta: '/seashell/drive/queryMeta',
  driveQueryOne: '/seashell/drive/queryOne',
  topicStatusChange: '/seashell/topic/editStatus',
  topicTagChange: '/seashell/topic/editTags',
  topicGet: '/seashell/topic/get',
  topicList: '/seashell/topic/list',
  topicCreate: '/seashell/topic/create',
  topicEdit: '/seashell/topic/edit',
  driveTags: '/seashell/tags/getDriveTags',
  fsInsertOne: '/seashell/fs/mutateInsertOne',
  fsRemoveOne: '/seashell/fs/mutateDelete',
  fsList: '/seashell/fs/queryFile',
  fsDownload: '/seashell/fs/download',
  fsMutateContent: '/seashell/fs/mutateFileContent',
  fsQueryContent: '/seashell/fs/queryFileContent',
  fsMutateName: '/seashell/fs/mutateFileName',
  userList: '/seashell/drive/queryUsers',
}

const api = Object.keys(apimap).reduce((left, right) => {
  left[right] = query => new Fetch(`${global.__SMILE_API}${apimap[right]}`, query).post()
  return left
}, {})

export default api
