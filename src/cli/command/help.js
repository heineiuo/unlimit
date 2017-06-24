import commands from '../commands'
import {info} from '../show'

export default () => new Promise(async (resolve, reject) => {
  info(
`
All Commands:
help, ${Object.keys(commands).join(', ')}

pnp clone [drive name]              Clone drive to current directory with same name.
pnp push [directory or file]        Push local file/directory to remote.
pnp pull [directory or directory]   Pull remote file/directory to local.
`
  )
  resolve()
})