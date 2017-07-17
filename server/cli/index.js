/**
 * pnp means pull and push
 */

import {argv} from 'yargs'
import commands from './commands'
import {fail} from './show'

process.nextTick(async () => {
  try {
    const userCommands = argv._.slice();

    const walkToExecCommand = (commands) => new Promise(async (resolve, reject) => {
      const command = commands[userCommands[0]];
      if (typeof command === 'undefined') return reject(new Error('Command not found! '))
      try {
        if (typeof command === 'function') return resolve(await command())
        userCommands.shift();
        resolve(await walkToExecCommand(command))
      } catch(e){
        reject(e)
      }
    })

    await walkToExecCommand(commands)

  } catch(e){
    fail(`${e.name}: ${e.message}`)
    // console.log(e.stack)
  }
})
