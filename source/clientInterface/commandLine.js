let style = { title: '\x1b[33m\x1b[1m\x1b[7m\x1b[36m', message: '\x1b[96m', italic: '\x1b[2m\x1b[3m', default: '\x1b[0m' }
console.log(`\x1b[2m\x1b[3m%s\x1b[0m`, `• Environment variables:`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `Command:`, `${process.argv.join(' ')}`)
/* shell script environmnet arguments - Log environment variables & shell command arguments */
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationKey = ${process.env.entrypointConfigurationKey}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationPath = ${process.env.entrypointConfigurationPath}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `targetAppBasePath = ${process.env.targetAppBasePath}`)

import path from 'path'
import assert from 'assert'
import filesystem from 'fs'
import vm from 'vm'
import ownConfiguration from '../functionality.config.js'
import { parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } from '@dependency/parseKeyValuePairSeparatedBySymbol'
import { configurationFileLookup } from '@deployment/configurationManagement'
import { scriptManager } from '../script.js'
import { loadStdin } from '../utility/loadStdin.js'
import { isJSCodeToEvaluate } from '../utility/isJSCodeToEvaluate.js'
import { splitArrayToTwoByDelimiter, divideArrayByFilter } from '../utility/splitArray.js'

cliInterface().catch(error => console.error(error))

/**
 * Could run in two modes:
 *  1. Evaluate code interface: Allows for calling this module `scriptManager` using javasript code from the commandline.
 *     In this case there are no parsed command arguments, only the first argument that contains JS code with all necessary parameters.
 *     USAGE:
 *       `yarn run scriptManager "({ scriptKeyToInvoke: 'sleep' })"`
 *       `yarn run scriptManager "({ scriptKeyToInvoke: 'sleep', jsCodeToEvaluate: '.setInterval()' })"`
 *       `yarn run scriptManager ".apply()"` - take note that also '.' is considered evaluate code.
 *  2. parsed arguments interface: This implementation, in contrast to the other code evaluation interface, requires mapping the needed commandline parsed arguments to the method parameters.
 *      Note: this contains evaluation code that is used by subsequent modules like "scriptExecution"
 *     USAGE:
 *      script invokation from shell using: npx || yarn run || <pathToScript e.g. './node_modules/.bin/scriptManager'>   (`yarn run` is prefered over `npx` because it correctly catches errors, i.e. its implementation is more complete.)
 *      $ `yarn run scriptManager targetProjectConfigPath=<> scriptKeyToInvoke=<filename> jsCodeToEvaluate=<js code> - <arguments passed to target script>`
 *      $ `yarn run scriptManager test - testType=unitTest debug`
 *      where `-` means the end of own module args and beginning of target script args (a slightlt different meaning than the convention in other shell scripts https://serverfault.com/questions/114897/what-does-double-dash-mean-in-this-shell-command).
 *      shorthand $ `yarn run scriptManager <scriptToInvoke> <jsCodeToEvaluate> - <arguments to target script>` e.g. `yarn run scriptManager sleep '.setInterval()'`
 *       `yarn scriptManager test ".runTest({ testPath: '${PWD}/test', targetProject: api.project })"` // where `api` is exposed by the scriptManager to the evaluated script.
 *       scriptConfig adapterFunction + `yarn scriptManager test ".runTest({ testPath: '${PWD}/test' })"` // where an adapter is provided in scriptConfig to set the 'targetProject' from the api of scriptManager.
 *
 *
 * [note] distinguish between the ownConfiguration and the target application configuration.
 */
async function cliInterface({
  commandArgument = process.argv.slice(2) /* remove first two arguments `runtime`, `module path` */,
  argumentDelimiter = '-', // delimiter symbol for differentiating own arguments from the target script arguments. using `-` instead of `--` because yarn removes the double slash (although in future version it won't, as was mentioned).
  currentDirectory = process.env.PWD || process.cwd() /*In case run in Windows where PWD is not set.*/,
  envrironmentArgument = process.env,
  scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
  targetProjectConfigPath, // the path to the configuration file of the target application. relative path to target project configuration from current working directory.
  jsCodeToEvaluate,
  shouldCompileScript,
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

  // target application configuration file:
  let configurationFileLookupCallback = configPath => {
    configPath = configurationFileLookup({
      configurationPath: configPath,
      currentDirectory,
      configurationBasePath: ownConfiguration.targetApp.configurationBasePath,
    }).path
    // assret entrypoint configuration objects/options exist.
    console.assert(require.resolve(configPath), '\x1b[41m%s\x1b[0m', `❌ Configuration file doesn't exist in ${configPath}`)
    return configPath
  }

  // [1] accepts a single argument string to be evaluated as JS code, in addition to environment variables for execution of the programmatic api.
  async function evaluateInterface() {
    scriptKeyToInvoke ||= envrironmentArgument.scriptKeyToInvoke
    targetProjectConfigPath ||= standartInputData || envrironmentArgument.targetConfig
    shouldCompileScript ||= envrironmentArgument.shouldCompileScript
    targetProjectConfigPath = configurationFileLookupCallback(targetProjectConfigPath)
    // string js code that will be used on the callback.
    let codeToEvaluateForOwnModule = ownCommandArgument[0],
      defaultEvaluateCallValueForFirstParameter = { targetProjectConfigPath, scriptKeyToInvoke, jsCodeToEvaluate, shouldCompileScript }
    // execute api using string evaluated code.
    let contextEnvironment = vm.createContext(
      Object.assign(global, {
        // wrapper function aroung 'scriptManager' in order to apply default values
        // TODO: User symbols if possible instead of a string for the wrapping function.
        _requiredModuleScriptManagerWrapper_: async (...args) => {
          // similar to a curry function wrapper, setting default values
          // process args setting default values
          args[0] = Object.assign(defaultEvaluateCallValueForFirstParameter, args[0]) // these are is specific number of parameters that `scriptManager` function has
          await scriptManager(...args).catch(error => console.log(error))
        },
      }),
    )
    try {
      // where `_` available in context of vm, calls `scriptManager` module.
      let vmScript = new vm.Script(`_requiredModuleScriptManagerWrapper_${codeToEvaluateForOwnModule}`, {
        filename: path.resolve('../') /* add file to Node's event loop stack trace */,
      })

      vmScript.runInContext(contextEnvironment, { breakOnSigint: true /* break when Ctrl+C is received. */ })
    } catch (error) {
      console.log(`❌ Running 'vm runInContext' code failed during execution.`)
      throw error
    }
  }

  // [2] accepts command arguments or environment variables as parameters for the execution of the programmatic api.
  async function passedArgumentInterface() {
    scriptKeyToInvoke ||= parsedCommandArgument.scriptKeyToInvoke || envrironmentArgument.scriptKeyToInvoke || nonPairArgument[0] // allow for shorthand command call.
    jsCodeToEvaluate ||= parsedCommandArgument.jsCodeToEvaluate || envrironmentArgument.scriptKeyToInvoke || nonPairArgument[1]
    shouldCompileScript ||= parsedCommandArgument.shouldCompileScript || envrironmentArgument.shouldCompileScript || nonPairArgument[2]
    process.argv[1] = scriptKeyToInvoke || process.argv[1] //The path to the script should be changed after script lookup by succeeding modules.
    // target application's configuration file parameter hierarchy
    targetProjectConfigPath ||= parsedCommandArgument.targetConfig || standartInputData /* stdin input */ || envrironmentArgument.targetConfig
    targetProjectConfigPath = configurationFileLookupCallback(targetProjectConfigPath)
    await scriptManager({ targetProjectConfigPath, scriptKeyToInvoke, jsCodeToEvaluate, shouldCompileScript }).catch(error => console.error(error))
  }

  // check if the first argument for is a Javascript code that should be evaluated on an imported module.
  isJSCodeToEvaluate({ string: nonPairArgument[0] }) ? await evaluateInterface() : await passedArgumentInterface()
}
