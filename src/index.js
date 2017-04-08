import {argv} from 'yargs'
import init from './init'
import startService from './service'

if (argv.startService) {
  process.nextTick(startService);
} else if (argv.init) {
  process.nextTick(init)
}