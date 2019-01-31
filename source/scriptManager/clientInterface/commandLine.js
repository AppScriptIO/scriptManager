let style = { title: '\x1b[33m\x1b[1m\x1b[7m\x1b[36m', message: '\x1b[96m', italic: '\x1b[2m\x1b[3m', default: '\x1b[0m' }
console.log(`\x1b[2m\x1b[3m%s\x1b[0m`,`• Environment variables:`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `Command:`, `${process.argv.join(' ')}`)
/* shell script environmnet arguments - Log environment variables & shell command arguments */
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationKey = ${process.env.entrypointConfigurationKey}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationPath = ${process.env.entrypointConfigurationPath}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `targetAppBasePath = ${process.env.targetAppBasePath}`)

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
import { splitArrayToTwoByDelimiter, divideArrayByFilter } from "../utility/splitArray.js"

cliInterface().catch(error => { console.error(error) })

/** 
 * Could run in two modes: 
 *  1. Evaluate code interface: Allows for calling this module `scriptManager` using javasript code from the commandline.
 *     In this case there are no parsed command arguments, only the first argument that contains JS code with all necessary parameters.
 *     USAGE: 
 *       `yarn run scriptManager "({ scriptKeyToInvoke: 'sleep' })"`
 *       `yarn run scriptManager "({ scriptKeyToInvoke: 'sleep', jsCodeToEvaluate: '.setInterval()' })"`
 *  2. parsed arguments interface: This implementation, in contrast to the other code evaluation interface, requires mapping the needed commandline parsed arguments to the method parameters.
 *     USAGE: 
 *      script invokation from shell using: npx || yarn run || <pathToScript e.g. './node_modules/.bin/scriptManager'>   (`yarn run` is prefered over `npx` because it correctly catches errors, i.e. its implementation is more complete.)
 *      $ `yarn run scriptManager targetAppConfigPath=<> scriptKeyToInvoke=<filename> jsCodeToEvaluate=<js code> - <arguments passed to target script>`
 *      where `-` means the end of own module args and beginning of target script args (a slightlt different meaning than the convention in other shell scripts https://serverfault.com/questions/114897/what-does-double-dash-mean-in-this-shell-command).
 *      shorthand $ `yarn run scriptManager <scriptToInvoke> <jsCodeToEvaluate> - <arguments to target script>` e.g. `yarn run scriptManager sleep '.setInterval()'`
 * 
 * [note] distinguish between the ownConfiguration and the target application configuration.
 */
async function cliInterface({
  envrironmentArgument = process.env,
  commandArgument = process.argv.slice(2), /* remove first two arguments `runtime`, `module path` */
  currentDirectory = process.env.PWD, 
  scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
  targetAppConfigPath, // the path to the configuration file of the target application. relative path to target project configuration from current working directory.
  argumentDelimiter = '-', // delimiter symbol for differentiating own arguments from the target script arguments. using `-` instead of `--` because yarn removes the double slash (although in future version it won't, as was mentioned).
  jsCodeToEvaluate
} = []) {

  /** Argument initialization, validation, sanitization 
   * get arguments - API of accepted varibales from (priority list)
   * 1. immediately passed argument in code. 
   * 2. Environment variables
   * 3. Commandline arguments
  */
  let standartInputData = await loadStdin() // in case in shell pipeline - get input
  // split commandline arguments by delimiter
  let [ownCommandArgument, targetScriptCommandArgument] = splitArrayToTwoByDelimiter({ array: commandArgument, delimiter: argumentDelimiter })
  let [pairArgument, nonPairArgument] = divideArrayByFilter({ array: ownCommandArgument, filterFunc: item => item.includes('=') }) // separate arguments that are key-value pair from the rest
  let parsedCommandArgument = parseKeyValuePairSeparatedBySymbolFromArray({ array: pairArgument, separatingSymbol: '=' }) // parse `key=value` node command line arguments
  // create command arguments for target script. 
  process.argv = [process.argv[0], process.argv[1] /* should be substituted by full target script path after lookup */, ...targetScriptCommandArgument] 

  const isEvaluateCodeInterface = isJSCodeToEvaluate({ string: nonPairArgument[0] })

  if(isEvaluateCodeInterface) {
    targetAppConfigPath = targetAppConfigPath || standartInputData || envrironmentArgument.targetConfig
    scriptKeyToInvoke = scriptKeyToInvoke || envrironmentArgument.scriptKeyToInvoke  
  } else {
    scriptKeyToInvoke = scriptKeyToInvoke || parsedCommandArgument.scriptKeyToInvoke || envrironmentArgument.scriptKeyToInvoke 
                          || nonPairArgument[0]   // allow for shorthand command call.
    jsCodeToEvaluate = jsCodeToEvaluate || parsedCommandArgument.jsCodeToEvaluate || envrironmentArgument.scriptKeyToInvoke
                        || nonPairArgument[1]   // allow for shorthand command call.
  
    // target application's configuration file parameter hierarchy
    targetAppConfigPath = targetAppConfigPath || parsedCommandArgument.targetConfig || standartInputData /* stdin input */ || envrironmentArgument.targetConfig
  
    process.argv[1] = scriptKeyToInvoke || process.argv[1] //The path to the script should be changed after script lookup by succeeding modules.
  }  

  // target application configuration file:
  ;({ path: targetAppConfigPath } = configurationFileLookup({
    configurationPath: targetAppConfigPath, 
    currentDirectory,
    configurationBasePath: ownConfiguration.targetApp.configurationBasePath
  }))
  // assret entrypoint configuration objects/options exist.
  console.assert(require.resolve(targetAppConfigPath), '\x1b[41m%s\x1b[0m', `❌ Configuration file doesn't exist in ${targetAppConfigPath}`)

  // check if the first argument for is a Javascript code that should be evaluated on an imported module.
  if(isEvaluateCodeInterface) 
    evaluateCodeInterface({
        codeToEvaluateForOwnModule: ownCommandArgument[0], 
        defaultEvaluateCallValueForFirstParameter: { targetAppConfigPath, scriptKeyToInvoke, jsCodeToEvaluate }
    }).catch(error => console.error(error))  
  else 
    await scriptManager({
      targetAppConfigPath,
      scriptKeyToInvoke, 
      jsCodeToEvaluate, 
    }).catch(error => { console.error(error) })
}

// execute api using string evaluated code.
async function evaluateCodeInterface({
  codeToEvaluateForOwnModule, // string js code that will be used on the callback.
  defaultEvaluateCallValueForFirstParameter = {},
  callback = scriptManager
} = {}) {
  let contextEnvironment = vm.createContext(Object.assign(
    global,
    {
      _requiredModule_: async (...args) => { // similar to a curry function wrapper, setting default values
        // process args setting default values
        args[0] = Object.assign(defaultEvaluateCallValueForFirstParameter, args[0]) // these are is specific number of parameters that `scriptManager` function has
        await callback(...args).catch(error => console.log(error))
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