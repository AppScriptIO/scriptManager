let style = { title: '\x1b[33m\x1b[1m\x1b[7m\x1b[36m', message: '\x1b[96m', italic: '\x1b[2m\x1b[3m', default: '\x1b[0m' }
console.log(`\x1b[2m\x1b[3m%s\x1b[0m`,`• Environment variables:`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `Command:`, `${process.argv.join(' ')}`)
/* shell script environmnet arguments - Log environment variables & shell command arguments */
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationKey = ${process.env.entrypointConfigurationKey}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationPath = ${process.env.entrypointConfigurationPath}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `externalAppBasePath = ${process.env.externalAppBasePath}`)

let nodeCommand = process.argv.slice(2) // remove first 2 commands - "<binPath>/node", "<path>/entrypoint.js"

import filesystem from 'fs'
import path from 'path'
import configuration from '@root/setup/configuration/configuration.js'
import { resolveEntrypointPathFromConfiguration, cliInterface } from './algorithm/resolveEntrypointModule.js'
import { parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } from '@dependency/parseKeyValuePairSeparatedBySymbol'
import { installModuleMultiple } from '@dependency/installNodeJSModule'
import { IsFileOrFolderJSModule } from '@dependency/JSModuleTypeCheck'
import { convertWindowsPathToUnix } from './utility/convertWindowsPathToUnix.js'
import findFileWalkingUpDirectory from 'find-up'

console.log(`\x1b[2m\x1b[3m%s\x1b[0m \n\t %s \n\t %s`, `• configuration:`, 
            `externalAppRootFolder = ${configuration.externalApp.rootFolder}`,
            `externalAppAppDeploymentLifecycle = ${configuration.externalApp.dependency.appDeploymentLifecycle}`)

process.on('SIGINT', () => { 
    console.log("Caught interrupt signal - managerApp container level")
    process.exit(0)
})
  
export async function run() {

    let nodeCommandKeyValueArgument = parseKeyValuePairSeparatedBySymbolFromArray({ array: process.argv })
    
    let entrypointConfig = cliInterface({ 
        envrironmentArgument: process.env,
        nodeCommandArgument: nodeCommandKeyValueArgument
    })
    
    // The applicationPathOnHostMachine is the path on the machine which docker client envoked manager app. In case of Docker for Windows, the path is a Windows path. While the path sent from a running container, should be refering to the hyper-v MobyLinuxVM (inside created by Docker for Windows are /host_mnt/c, with symlinks /c & /C).
    process.env.applicationPathOnHostMachine = convertWindowsPathToUnix({ path: process.env.applicationPathOnHostMachine }) // change Windows path to Unix path - Note that using Unix / on Windows works perfectly inside nodejs, so there's no reason to stick to the Windows legacy at all.
    
    let entrypointModulePath = resolveEntrypointPathFromConfiguration({ entrypointConfig })

    await installEntrypointModule({ entrypointModulePath })

    // TODO: 
    // Pass relevant parameters used to create container structure to the module.

    // require entrypoint module.
    try {
        console.log('\x1b[45m%s\x1b[0m \x1b[2m\x1b[3m%s\x1b[0m', `Module:`, `Running NodeJS entrypoint module`)
        console.log(`\t\x1b[2m\x1b[3m%s\x1b[0m \x1b[95m%s\x1b[0m`, `File path:`, `${entrypointModulePath}`)
        let returned = require(entrypointModulePath) // pass arguments as application root path (rootPath: {  })
    } catch (error) {
        throw error
    }

}

async function installEntrypointModule({ entrypointModulePath }) {
    // install node_modules for entrypoint module if not present in case a folder is being passed.
    // ISSUE - installing node_modules of and from within running module, will fail to load the newlly created moduules as node_modules path was already read by the nodejs application.
    let installDirectory,
        moduleType = IsFileOrFolderJSModule({ modulePath: entrypointModulePath });
    switch(moduleType) {
        case 'directory':
            installDirectory = entrypointModulePath
        break;
        case 'file':
            installDirectory = path.dirname(entrypointModulePath) 
        break;
    }
    // Install node_modules
    // in case package.json doesn't exist in script's path, then check upper directories for the closest package.json and install if no node_modules located. This is because the yarn install if doesn't detect package.json file it will search for it in the upper directories and install the closest one.
    let closestPackageJsonPath = await findFileWalkingUpDirectory('package.json', { cwd: installDirectory }),
        closestPackageJsonDirectoryPath = (closestPackageJsonPath) ? path.dirname(closestPackageJsonPath) : false;
    if(closestPackageJsonDirectoryPath) {
        let isNodeModuleInstallExist = filesystem.existsSync(path.join(closestPackageJsonDirectoryPath, `node_modules`))
        if (!isNodeModuleInstallExist) {
            await installModuleMultiple({ installPathArray: [ installDirectory ] }) // install modules
        }
    }
}