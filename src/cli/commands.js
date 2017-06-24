
import status from './command/showMeta'
import showGlobal from './command/showGlobal'
import setGlobal from './command/setGlobal'
import clone from './command/clone'
import pull from './command/pull'
import push from './command/push'
import help from './command/help'
import remoteFileInfo from './command/remoteFileInfo'

export default {
  status,
  clone,
  pull,
  push,
  help,
  config: {
    set: setGlobal,
    get: showGlobal
  },
  fetch: {
    meta: remoteFileInfo
  }
}