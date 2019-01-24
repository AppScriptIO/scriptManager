
import filesystem from 'fs'
import path from 'path'
import ownConfiguration from '../../configuration/configuration.js'
import { scriptExecution } from '@dependency/scriptExecution'
import { Application } from './Application.class.js'

process.on('SIGINT', () => { 
    console.log("Caught interrupt signal - scriptManager container level")
    process.exit(0)
})
  
export async function scriptManager({
    targetAppConfigPath, // configuration object of the target application.
    scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
}) {
    let app = new Application({ configurationPath: targetAppConfigPath })

    // TODO: Add support for multiple applications to be managed and multiple scripts to be run and tracked.

    // load entrypoint configuration and check for 'entrypoint' key (entrypoint key holds object with entrypoint information like file path mapping)
    let scriptConfigArray = app.configuration['script']
    console.assert(scriptConfigArray, '\x1b[41m%s\x1b[0m', `❌ config['script'] option in targetApp configuration must exist.`)

    await scriptExecution({ script: scriptConfigArray, appRootPath: app.configuration.rootPath, scriptKeyToInvoke })
            .catch(error => { console.error(error) })

}

