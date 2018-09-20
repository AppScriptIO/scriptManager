#!/usr/bin/env node 
// Shebang (#!) above allows for invoking this file directly on Unix-like platforms.

/**
 *  run container manager with requested command.
 *  ./setup/node_modules/.bin/containerManager configuration=./setup/configuration/configuration.js entrypointConfigurationKey=test
 * */ 
const path = require('path')
const assert = require('assert')
const resolve = require('resolve')
const moduleRootPath = `${__dirname}/../../../`
const { runManagerAppInContainerWithClientApp } = require(moduleRootPath) 
const message_prefix = `\x1b[3m\x1b[2m•[${path.basename(__filename)} JS script]:\x1b[0m`
console.group(`%s \x1b[33m%s\x1b[0m`,`${message_prefix}`,`ƒ container manager - container with volumes & requested entrypoint script`)

function invoke({ configurationPath, managerAppHostRelativePath }) {
    const configuration = require(configurationPath),
          applicationRootPath = configuration.directory.application.hostAbsolutePath
    console.log(configuration.directory.application.hostAbsolutePath)
    runManagerAppInContainerWithClientApp({
        application: {
            hostPath: configuration.directory.application.hostAbsolutePath, 
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
    var { parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } = require('@dependency/parseKeyValuePairSeparatedBySymbol')
    const namedArgs = parseKeyValuePairSeparatedBySymbolFromArray({ array: process.argv }) // ['x=y'] --> { x: y }
    // assert(namedArgs.configuration, )
    if(!namedArgs.configuration) {
        console.log(`%c45455455`, 'color: #F99157;', 'X `configuration` parameter (relative configuration path from PWD) in command line argument must be set.')
    }
    const configurationPath = (namedArgs.configuration) ? 
        path.join(process.env.PWD, namedArgs.configuration) : 
        path.join(process.env.PWD, 'configuration'); // default seach in prim house
    process.argv = process.argv.filter(value => value !== `configuration=${namedArgs.configuration}`) // remove configuration paramter

    let workingDirectoryPath = path.normalize(process.env.PWD),
        scriptPath = path.normalize(process.argv[1]),
        relativeScriptFromPWDPath = path.relative(workingDirectoryPath, scriptPath),
        nodeModulesPartialPath = ['node_modules'].concat(relativeScriptFromPWDPath.split('node_modules').slice(1)).join(''), // get path elements after first node_modules appearance i.e. /x/node_modules/y --> node_modules/y
        nodeModulesParentPartialPath = relativeScriptFromPWDPath.split('node_modules').shift(), // /x/node_modules/y --> /x/
        nodeModulesParentPath = path.join(workingDirectoryPath, nodeModulesParentPartialPath)
    const managerAppHostRelativePath = path.dirname( resolve.sync('@dependency/appDeploymentManager/package.json', { preserveSymlinks: true, basedir: nodeModulesParentPath }) ) // use 'resolve' module to allow passing 'preserve symlinks' option that is not supported by require.resolve module.
    
    invoke({ configurationPath, managerAppHostRelativePath})
}

cliInterface()