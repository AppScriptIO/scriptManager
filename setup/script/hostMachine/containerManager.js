// run container manager with requested command.
const message_prefix = `\x1b[3m\x1b[2m•[${path.basename(__filename)} JS script]:\x1b[0m`
console.group(`%s \x1b[33m%s\x1b[0m`,`${message_prefix}`,`ƒ container manager - container with volumes & requested entrypoint script`)

import path from 'path'
import { runManagerAppInContainerWithClientApp } from "../../.." // own package (@dependency/appDeploymentEnvironment)
const appDeploymentEnvironmentPath = path.dirname( require.resolve('../../../package.json') ) // own package root path

runManagerAppInContainerWithClientApp({
    applicationHostPath: path.normalize(path.join(__dirname, '../../../')),
    managerAppHostPath:  appDeploymentEnvironmentPath
})