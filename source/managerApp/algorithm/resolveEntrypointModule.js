import filesystem from 'fs'
import path from 'path'
import configuration from '@root/setup/configuration/configuration.js'

export function resolveEntrypointPathFromConfiguration({
    entrypointConfig // object of entrypoint configuration
}) {

    // entrypoint module path
    let entrypointModulePath // entrypoint module path
    if(entrypointConfig['path']) {
        entrypointModulePath = (!path.isAbsolute(entrypointConfig['path'])) ? // check if is relative or absolute.
            path.join(configuration.externalApp.rootFolder, entrypointConfig['path']) : // resolve path relative to root.
            entrypointConfig['path'];
    } else {
        // default entrypoint file location if no path option present in configuration file. Try to find the key name as file name in default entrypointFolder.
        entrypointModulePath = path.join(configuration.externalApp.entrypointFolder, `${entrypointConfig.key}`) // .js file or folder module.
    }
    
    return entrypointModulePath    
}

// returns arguments that can be used in 'resolveEntrypointPathFromConfiguration' function, that where produced from the CLI issued commands
export function cliInterface({
    // key value pair object representing the passed values.
    envrironmentArgument,
    nodeCommandArgument, 
    entrypointConfigurationKey,
    entrypointConfigurationPath
 } = {}) {
    /**
     * get arguments - API of accepted varibales from (priority list)
     * 1. immediately passed argument in code. 
     * 2. container passed environment variables
     * 3. CLI arguments
     */
    entrypointConfigurationKey = 
        entrypointConfigurationKey || 
        envrironmentArgument.entrypointConfigurationKey ||
        nodeCommandArgument.entrypointConfigurationKey
    console.assert(entrypointConfigurationKey, '\x1b[41m%s\x1b[0m', '❌ entrypointConfigurationKey must be set.') // assert entrypoint env variables exist

    entrypointConfigurationPath = 
        entrypointConfigurationPath ||
        envrironmentArgument.entrypointConfigurationPath || 
        nodeCommandArgument.entrypointConfigurationPath || 
        configuration.externalApp.configurationFilePath // default configuration path
    // assret entrypoint configuration objects/options exist.
    console.assert(filesystem.existsSync(entrypointConfigurationPath), '\x1b[41m%s\x1b[0m', `❌ Configuration file doesn't exist in ${entrypointConfigurationPath}`)

    // load entrypoint configuration and check for 'entrypoint' key (entrypoint key holds object with entrypoint information like file path mapping)
    let entrypointConfigList = require(entrypointConfigurationPath)['script']['container']
    console.assert(entrypointConfigList, '\x1b[41m%s\x1b[0m', `❌ config['script']['container'] options (config.entrypoint) in externalApp configuration must exist.`)

    // get specific entrypoint configuration option (entrypoint.configKey)
    let entrypointConfig = entrypointConfigList.find(config => config.key == entrypointConfigurationKey)
    // assert entrypointConfig exist
    if(!entrypointConfig) {
        console.log(`entrypointConfigList: \n`, entrypointConfigList)
        let errorMessage = `❌ Reached switch default as entrypointConfigurationKey "${entrypointConfigurationKey}" does not match any case/kind/option`
        throw new Error(`\x1b[41m${errorMessage}\x1b[0m`)
    }

    return entrypointConfig
}