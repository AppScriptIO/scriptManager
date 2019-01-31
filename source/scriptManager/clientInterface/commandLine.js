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
import vm from 'vm'
import ownConfiguration from '../../../configuration/configuration.js'
import { parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } from '@dependency/parseKeyValuePairSeparatedBySymbol'
import { configurationFileLookup } from '@dependency/configurationManagement'
import { scriptManager } from '../'
import { loadStdin } from "../utility/loadStdin.js"
import { isJSCodeToEvaluate } from '../utility/isJSCodeToEvaluate.js'
import { splitArrayToTwoByDelimiter } from "../utility/splitArray.js"

// choose mode of the cli execution depending on the command line arguments
;(function() {

  let firstCommandArgument = process.argv[2]
  // check if the first argument for is a Javascript code that should be evaluated on an imported module.
  if(isJSCodeToEvaluate({ string: firstCommandArgument })) 
    cliInterfaceEvaluate().catch(error => console.error(error))  
  else 
    cliInterface().catch(error => console.error(error))
})()

/**
 * This implementation, in contrast to the other cliInterfaceEvaluate, requires mapping the needed commandline parsed arguments to the method parameters.
 * distinguish between the ownConfiguration and the target application configuration.
 * USAGE: 
 *  script invokation from shell using: npx || yarn run || <pathToScript e.g. './node_modules/.bin/scriptManager'>   (`yarn run` is prefered over `npx` because it correctly catches errors, i.e. its implementation is more complete.)
 *  $ `yarn run scriptManager targetAppConfigPath=<> scriptKeyToInvoke=<filename> jsCodeToEvaluate=<js code> -- <arguments passed to target script>`
 *  where `--` means the end of own module args and beginning of target script args (a slightlt different meaning than the convention in other shell scripts https://serverfault.com/questions/114897/what-does-double-dash-mean-in-this-shell-command).
 *  shorthand $ `yarn run scriptManager <scriptToInvoke> <jsCodeToEvaluate>` e.g. `yarn run scriptManager sleep '.setInterval()'`
 */
async function cliInterface({
  // key value pair object representing the passed values.
  envrironmentArgument = process.env,
  commandArgument = process.argv.slice(2),
  currentDirectory = process.env.PWD, 
  scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
  jsCodeToEvaluate, // javascript code to evaluate on target script. 
  targetAppConfigPath, // the path to the configuration file of the target application. relative path to target project configuration from current working directory.
  argumentDelimiter = '--', // delimiter symbol for differentiating own arguments from the target script arguments.
} = {}) {
  console.log(`\x1b[33m\x1b[1m\x1b[7m\x1b[36m%s\x1b[0m \x1b[2m\x1b[3m%s\x1b[0m`, `Script:`, `NodeJS App`)

  /** Argument initialization, validation, sanitization */
  let standartInputData = await loadStdin() // in case in shell pipeline - get input
  // split array by `--` delimiter
  let [ownCommandArgument, targetScriptCommandArgument] = splitArrayToTwoByDelimiter({ array: commandArgument, delimiter: argumentDelimiter })
  let parsedCommandArgument = parseKeyValuePairSeparatedBySymbolFromArray({ array: ownCommandArgument }) // parse `key=value` node command line arguments

  /**
   * get arguments - API of accepted varibales from (priority list)
   * 1. immediately passed argument in code. 
   * 2. container passed environment variables
   * 3. CLI arguments
   */
  scriptKeyToInvoke = scriptKeyToInvoke || envrironmentArgument.scriptKeyToInvoke || parsedCommandArgument.scriptKeyToInvoke 
                        || ownCommandArgument[0]   // allow for shorthand command call.
  jsCodeToEvaluate = parsedCommandArgument.jsCodeToEvaluate 
                      || ownCommandArgument[1]   // allow for shorthand command call.

  // target application's configuration file parameter hierarchy
  targetAppConfigPath = targetAppConfigPath || parsedCommandArgument.targetConfig || standartInputData /* stdin input */ || envrironmentArgument.targetConfig

  // target application configuration file:
  ;({ path: targetAppConfigPath } = configurationFileLookup({
    configurationPath: targetAppConfigPath, 
    currentDirectory,
    configurationBasePath: ownConfiguration.targetApp.configurationBasePath
  }))
  // assret entrypoint configuration objects/options exist.
  console.assert(require.resolve(targetAppConfigPath), '\x1b[41m%s\x1b[0m', `❌ Configuration file doesn't exist in ${targetAppConfigPath}`)

  await scriptManager({
    targetAppConfigPath,
    scriptKeyToInvoke, 
    jsCodeToEvaluate, 
  }).catch(error => { console.error(error) })

}

/** 
 * Allows for calling this module `scriptManager` using javasript code from the commandline.
 * In this case there are no parsed command arguments, only the first argument that contains JS code with all necessary parameters.
 * Example: 
 *  `yarn run scriptManager "({ scriptKeyToInvoke: 'sleep' })"`
 *  `yarn run scriptManager "({ scriptKeyToInvoke: 'sleep', jsCodeToEvaluate: '.setInterval()' })"`
 */
async function cliInterfaceEvaluate({
  // key value pair object representing the passed values.
  scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
  targetAppConfigPath, // the path to the configuration file of the target application.
  currentDirectory = process.env.PWD, 
  codeToEvaluateForOwnModule = process.argv[2],
  envrironmentArgument = process.env,
} = {}) {

  let standartInputData = await loadStdin() // in case in shell pipeline - get input
  targetAppConfigPath = targetAppConfigPath || standartInputData || envrironmentArgument.targetConfig
  scriptKeyToInvoke = scriptKeyToInvoke || envrironmentArgument.scriptKeyToInvoke

  // target application configuration file:
  ;({ path: targetAppConfigPath } = configurationFileLookup({
    configurationPath: targetAppConfigPath, 
    currentDirectory,
    configurationBasePath: ownConfiguration.targetApp.configurationBasePath
  }))
  // assret entrypoint configuration objects/options exist.
  console.assert(require.resolve(targetAppConfigPath), '\x1b[41m%s\x1b[0m', `❌ Configuration file doesn't exist in ${targetAppConfigPath}`)
  
  let contextEnvironment = vm.createContext(Object.assign(
    global,
    {
      _requiredModule_: async (...args) => { // similar to a curry function wrapper, setting default values
        // process args setting default values
        args[0] = Object.assign({
          targetAppConfigPath, 
          scriptKeyToInvoke
        }, args[0])
        await scriptManager(...args).catch(error => console.log(error))
      }, 
      
    }
  ))

  try {
      // where `_` available in context of vm, calls `scriptManager` module.
      let vmScript = new vm.Script(`
        _requiredModule_${codeToEvaluateForOwnModule}
        `, { 
          filename: path.resolve('../') /* add file to Node's event loop stack trace */ 
        })
    
      vmScript.runInContext(contextEnvironment, { breakOnSigint: true /* break when Ctrl+C is received. */ })    
  } catch (error) {
      console.log(`❌ Running 'vm runInContext' code failed during execution.`)
      throw error
  }

}