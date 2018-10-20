#!/usr/bin/env node 
// Shebang (#!) above allows for invoking this file directly on Unix-like platforms.

/**
 *  run container manager with requested command.
 *  ./setup/node_modules/.bin/containerManager configuration=./setup/configuration/configuration.js entrypointConfigurationKey=test
 * */ 
const path = require('path')
const assert = require('assert')
const resolve = require('resolve')
const slash = require('slash') // convert backward Windows slash to Unix/Windows supported forward slash.
const moduleRootPath = `${__dirname}/../../../`
const { runManagerAppInContainerWithClientApp } = require(moduleRootPath) 
const ownConfig = require(path.join(moduleRootPath, 'setup/configuration/configuration.js')) // container manager config path
const message_prefix = `\x1b[3m\x1b[2m•[${path.basename(__filename)} JS script]:\x1b[0m`
console.group(`%s \x1b[33m%s\x1b[0m`,`${message_prefix}`,`ƒ container manager - container with volumes & requested entrypoint script`)

function invoke({ configurationPath, applicationConfig, managerAppHostRelativePath }) {

    console.log(`Application root path: ${applicationConfig.directory.application.hostAbsolutePath}`)
    runManagerAppInContainerWithClientApp({
        configurationAbsoluteHostPath: configurationPath,
        application: {
            hostPath: applicationConfig.directory.application.hostAbsolutePath, 
            configuration: applicationConfig
        },
        managerApp: {
            hostRelativePath: managerAppHostRelativePath
        },
        invokedDirectly: (require.main === module) ? true : false
    })
} 

/**
 * USAGE: 
 *  script invokation from shell using: npx || yarn run || <pathToScript>
 *  Shell: npx cliAdapter configuration=<relativePathToConfigurationFromPWD> <filename>
 */
function cliInterface() {
    let { parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } = require('@dependency/parseKeyValuePairSeparatedBySymbol')
    const workingDirectoryPath = path.normalize(process.cwd())
    const namedArgs = parseKeyValuePairSeparatedBySymbolFromArray({ array: process.argv }) // ['x=y'] --> { x: y }
    let { applicationConfig, configurationPath } = getAppConfiguration({ configPathRelativeToCWD: namedArgs.configuration, workingDirectoryPath })
    
    let scriptPath = path.normalize(process.argv[1]),
        relativeScriptFromPWDPath = path.relative(workingDirectoryPath, scriptPath),
        nodeModulesPartialPath = ['node_modules'].concat(relativeScriptFromPWDPath.split('node_modules').slice(1)).join(''), // get path elements after first node_modules appearance i.e. /x/node_modules/y --> node_modules/y
        nodeModulesParentPartialPath = relativeScriptFromPWDPath.split('node_modules').shift(), // /x/node_modules/y --> /x/
        nodeModulesParentPath = path.join(workingDirectoryPath, nodeModulesParentPartialPath)
    const managerAppHostRelativePath = path.dirname( resolve.sync('@dependency/appDeploymentManager/package.json', { preserveSymlinks: true, basedir: nodeModulesParentPath }) ) // use 'resolve' module to allow passing 'preserve symlinks' option that is not supported by require.resolve module.
    invoke({ configurationPath, applicationConfig, managerAppHostRelativePath})
}

/**
 * Find configuration file according to specific assumptions and configuration of this module with preset defaults.
 * Assumptions made: 
 *  - 'configuration' argument set relative to current working directory.
 * or
 *  - current working directory is the location where 'configuration' module should be present (e.g. '<app path>/setup')
 */
function getAppConfiguration({ configPathRelativeToCWD, workingDirectoryPath } = {}) { 
    let configurationPathArray = [], configurationAbsolutePath;
    
    if(configPathRelativeToCWD) configurationPathArray.push(path.join(workingDirectoryPath, configPathRelativeToCWD))
    
    // default where the assumption that script executed in path '<app path>/setup'
    if(Array.isArray(ownConfig.externalApp.defaultConfigPathRelativeToCWD)) {
        configurationPathArray = configurationPathArray.concat(ownConfig.externalApp.defaultConfigPathRelativeToCWD.map(relativePath => path.join(workingDirectoryPath, relativePath)))        
    } else {
        configurationPathArray.push(path.join(workingDirectoryPath, ownConfig.externalApp.defaultConfigPathRelativeToCWD))
    }
    
    let applicationConfig, errorAccumulator = [], index = 0;
    while(index < configurationPathArray.length) {
        let configurationPath = configurationPathArray[index]
        try {
            applicationConfig = require(configurationPath)
            configurationAbsolutePath = configurationPath
            break;
        } catch(error) {
            // try requiring all array loops
            errorAccumulator.push(error)
        }
        index++
    }
    if(!applicationConfig) {
        console.log(`%c45455455`, 'color: #F99157;', 'X `configuration` parameter (relative configuration path from PWD) in command line argument must be set.')
        console.log(errorAccumulator)
        throw new Error('• Lookup algorithm for app configuration path from current working directory failed.')
    }

    process.argv = process.argv.filter(value => value !== `configuration=${configPathRelativeToCWD}`) // remove configuration paramter

    return { applicationConfig, configurationPath: configurationAbsolutePath }
}

cliInterface()