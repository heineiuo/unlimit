import version from './version'

export const actions = {
  '/': version['/'],
  account: require('./account').default,
  fs: require('./fs').default,
  drive: require('./drive').default,
  version
}

export const locations = []
