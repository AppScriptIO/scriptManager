let style = { title: '\x1b[33m\x1b[1m\x1b[7m\x1b[36m', message: '\x1b[96m', italic: '\x1b[2m\x1b[3m', default: '\x1b[0m' }
console.log(`\x1b[2m\x1b[3m%s\x1b[0m`,`• Environment variables:`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `Command:`, `${process.argv.join(' ')}`)
/* shell script environmnet arguments - Log environment variables & shell command arguments */
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationKey = ${process.env.entrypointConfigurationKey}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `entrypointConfigurationPath = ${process.env.entrypointConfigurationPath}`)
console.log(`\t${style.italic}%s${style.default} ${style.message}%s${style.default}`, `env:`, `externalAppBasePath = ${process.env.externalAppBasePath}`)

let nodeCommand = process.argv.slice(2) // remove first 2 commands - "<binPath>/node", "<path>/entrypoint.js"

import configuration from '@root/setup/configuration/configuration.js'
import { executeEntrypointConfiguration, cliInterface } from './algorithm/executeEntrypointConfiguration.js'
import { parseKeyValuePairSeparatedBySymbolFromArray, combineKeyValueObjectIntoString } from '@dependency/parseKeyValuePairSeparatedBySymbol'

console.log(`\x1b[2m\x1b[3m%s\x1b[0m \n\t %s \n\t %s`, `• configuration:`, 
            `externalAppRootFolder = ${configuration.externalApp.rootFolder}`,
            `externalAppAppDeploymentLifecycle = ${configuration.externalApp.dependency.appDeploymentLifecycle}`)

let nodeCommandKeyValueArgument = parseKeyValuePairSeparatedBySymbolFromArray({ array: process.argv })

let entrypointConfig = cliInterface({ 
    envrironmentArgument: process.env,
    nodeCommandArgument: nodeCommandKeyValueArgument
})

executeEntrypointConfiguration({ entrypointConfig })