let style = { title: '\x1b[33m\x1b[1m\x1b[7m\x1b[36m', message: '\x1b[96m', italic: '\x1b[2m\x1b[3m', default: '\x1b[0m' }
console.log(`\x1b[2m\x1b[3m%s\x1b[0m`,`• Environment variables:`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `Command:`, `${process.argv.join(' ')}`)
/* shell script environmnet arguments - Log environment variables & shell command arguments */
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationKey = ${process.env.entrypointConfigurationKey}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationPath = ${process.env.entrypointConfigurationPath}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `targetAppBasePath = ${process.env.targetAppBasePath}`)

let nodeCommand = process.argv.slice(2) // remove first 2 commands - "<binPath>/node", "<path>/entrypoint.js"


import path from 'path'
import assert from 'assert'
import filesystem from 'fs'
import ownConfiguration from '../../../configuration/configuration.js'
import { parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } from '@dependency/parseKeyValuePairSeparatedBySymbol'
import { configurationFileLookup } from '@dependency/configurationManagement'
import { scriptManager } from '../'

cliInterface()

/**
 * distinguish between the ownConfiguration and the target application configuration.
 * USAGE: 
 *  script invokation from shell using: npx || yarn run || <pathToScript>
 *  (`yarn run` is prefered over `npx` because it correctly catches errors, i.e. its implementation is more complete.)
 *  Shell: yarn run scriptManager configuration=<relativePathToConfigurationFromPWD> <filename>
 *  Shell: npx scriptManager configuration=<relativePathToConfigurationFromPWD> <filename>
 */
function cliInterface({
  // key value pair object representing the passed values.
  envrironmentArgument = process.env,
  commandArgument = process.argv,
  scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
  targetAppConfigPath, // the path to the configuration file of the target application.
  currentDirectory = process.env.PWD
} = {}) {
  console.log(`\x1b[33m\x1b[1m\x1b[7m\x1b[36m%s\x1b[0m \x1b[2m\x1b[3m%s\x1b[0m`, `Script:`, `NodeJS App`)

  /** Argument initialization, validation, sanitization */
  let nodeCommandArgument = parseKeyValuePairSeparatedBySymbolFromArray({ array: commandArgument }) // parse `key=value` node command line arguments
  // target application's configuration file parameter hierarchy
  targetAppConfigPath = targetAppConfigPath || nodeCommandArgument.targetConfig || envrironmentArgument.targetConfig

  /**
   * get arguments - API of accepted varibales from (priority list)
   * 1. immediately passed argument in code. 
   * 2. container passed environment variables
   * 3. CLI arguments
   */
  scriptKeyToInvoke = scriptKeyToInvoke || envrironmentArgument.scriptKeyToInvoke || nodeCommandArgument.scriptKeyToInvoke
  console.assert(scriptKeyToInvoke, '\x1b[41m%s\x1b[0m', '❌ `scriptKeyToInvoke` parameter must be set.')

  // target application configuration file:
  ;({ path: targetAppConfigPath } = configurationFileLookup({
    configurationPath: targetAppConfigPath, 
    currentDirectory,
    configurationBasePath: ownConfiguration.targetApp.configurationBasePath
  }))
  // assret entrypoint configuration objects/options exist.
  console.assert(require.resolve(targetAppConfigPath), '\x1b[41m%s\x1b[0m', `❌ Configuration file doesn't exist in ${targetAppConfigPath}`)
  
  scriptManager({
    targetAppConfigPath,
    scriptKeyToInvoke
  }).catch(error => { console.error(error) })


}
