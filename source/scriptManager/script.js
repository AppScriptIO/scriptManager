
import filesystem from 'fs'
import path from 'path'
import ownConfiguration from '../../configuration/configuration.js'
import { scriptExecution } from '@dependency/scriptExecution'
import { Project } from './Project.class.js'

process.on('SIGINT', () => { 
    console.log("Caught interrupt signal - scriptManager container level")
    process.exit(0)
})
  
// TODO: Add support for multiple project to be managed and multiple scripts to be run and tracked.

export async function scriptManager({
    targetProjectConfigPath, // configuration object of the target project.
    scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
    jsCodeToEvaluate // js to evaluate on the required script => 'require(<scriptPath>)<evaluate js>'
}) {
    console.assert(scriptKeyToInvoke, '\x1b[41m%s\x1b[0m', '❌ `scriptKeyToInvoke` parameter must be set.')
    
    let project = new Project({ configurationPath: targetProjectConfigPath })

    // load entrypoint configuration and check for 'entrypoint' key (entrypoint key holds object with entrypoint information like file path mapping)
    let scriptConfigArray = project.configuration['script']
    console.assert(scriptConfigArray, '\x1b[41m%s\x1b[0m', `❌ config['script'] option in targetProject configuration must exist.`)

    await scriptExecution({
        script: scriptConfigArray, 
        projectRootPath: project.configuration.rootPath, 
        scriptKeyToInvoke, 
        jsCodeToEvaluate, 
        executeWithParameter: [{ project: project }] // pass project api
    }).catch(error => { console.error(error) })
}

