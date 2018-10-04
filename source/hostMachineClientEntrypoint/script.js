import { spawn, spawnSync } from 'child_process'
import operatingSystem from 'os'
import path from 'path'
import slash from 'slash' // convert backward Windows slash to Unix/Windows supported forward slash.
import { setInterval } from 'timers';
import { convertObjectToDockerEnvFlag } from './utility/convertObjectToDockerEnvFlag.js'
const containerPath = { // defined paths of volumes inside container.
    application: '/project/application'
}

/**
 * Spins a container and passes entrypoint node script the relevant parameters used as: 
 *  - Application root path
 *  - Manager path in container
 */
export function runManagerAppInContainerWithClientApp(input) {
    console.log(process.argv)
    // TODO: Nested objects as paramaeters proxy implementation - create a proxy for functions to add support for function parameter destructuring of nested objects with preservation of objects and it`s properties, instead of creating individual separated parameters.
    // use nested objects as function parameters - an implementation of destructuring that preserves nested structure of parameters and default values. TODO: Issue - doesn't throw if parameters not passed.
    let application = {}, managerApp = {}, invokedDirectly;
    ({
        application: {
            hostPath: application.hostPath, // the Windows host application path
            configuration: application.configuration,
            pathInContainer: application.pathInContainer = application.configuration.directory.application.containerAbsolutePath || containerPath.application
        },
        // as default the managerApp should be installed (i.e. expected to be a dependency) as a dependency in a nested folder to the application.
        managerApp: {
            hostRelativePath: managerApp.hostRelativePath,
            commandArgument: managerApp.commandArgument = process.argv,
        },
        invokedDirectly = false
    } = input) // destructure nested objects to the object properties themselves.

    managerApp.commandArgument = (invokedDirectly) ? 
        managerApp.commandArgument.slice(2) : // remove first 2 commands only - "<binPath>/node", "<path>/containerManager.js".
        managerApp.commandArgument.slice(3), // remove first 2 commands - "<binPath>/node", "<path>/entrypoint.js" and the third host machine script name "containerManager"

    managerApp.relativePathFromApplication = path.relative(application.hostPath, managerApp.hostRelativePath)
    managerApp.relativePathFromApplication = slash(managerApp.relativePathFromApplication) // convert to Unix path from Windows path (change \ slash to /)
    // NOTE: creating an absolute path for managerApp assumes that the module exist under the application directory (/project/application).
    managerApp.absolutePathInContainer = slash(path.join(application.pathInContainer, managerApp.relativePathFromApplication)) // create an absolute path for managerApp which should be nested to application path.

    // resolve working directory path from host path to container path.
    let hostWorkingDirectory = process.env.PWD,
        workingDirectoryRelativeToApp = slash(path.relative(application.hostPath, hostWorkingDirectory)),
        workingDirectoryInContainer = slash(path.join(application.pathInContainer, workingDirectoryRelativeToApp)) // absolute container path of working directory 

    let childProcessArray = [];
    function killChildProcess({childProcesses = childProcessArray} = {}) {
        childProcesses.forEach((childProcess, index) => {
            childProcess.kill('SIGINT')
            childProcess.kill('SIGTERM')
            childProcesses.splice(index, 1) // remove item from array
        })
        // process.exit()
    }

    // NETWORK
    let networkName = 'managerApp'
    {
        let createNetwork = spawnSync('docker', [`network create ${networkName}`], { 
            detached: false, shell: true, stdio: [ 'inherit', 'inherit', 'ignore'],
            env: process.env // pass environment variables like process.env.PWD to spawn process
        })
        if(createNetwork.status == 1) console.log('Docker network already exist.')
    }

    // RETHINKDB
    {
        let image = 'rethinkdb:latest', // this container should have docker client & docker-compose installed in.
            processCommand = 'docker',
            containerCommand = ``,
            containerPrefix = 'managerApp_rehinkdb', 
            networkAlais = 'rethinkdb'
    
        let processArg = [
                `run`,
                `--rm`, // automatically remove after container exists.
                // `--interactive --tty`, // allocate a terminal - this allows for interacting with the container process.
                // `--volume ${application.hostPath}:${application.pathInContainer}`,
                `--network-alias ${networkAlais}`,
                `--network=${networkName}`,
                `-P `
                // `-P`
            ]
            // .concat(convertObjectToDockerEnvFlag(process.env))  // pass all envrinment variables - causes issues as some variables like `PATH` are related to the executed script
            .concat([
                `--name ${containerPrefix}`,
                `${image}`
            ])
        console.log(
            `%s \n %s \n %s`,
            `\x1b[3m\x1b[2m > ${processCommand} ${processArg.join(' ')}\x1b[0m`,
            `\t\x1b[3m\x1b[2mimage:\x1b[0m ${image}`,
            `\t\x1b[3m\x1b[2mcommand:\x1b[0m ${containerCommand}`
        )    
        
        let childProcess = spawn(processCommand, processArg, { 
            // detached: false, shell: true, stdio: [ 'inherit', 'inherit', 'inherit', 'ipc' ],
            detached: false, shell: true, stdio: [ 'ignore', 'ignore', 'ignore' ],
            env: process.env // pass environment variables like process.env.PWD to spawn process
        })
        childProcessArray.push(childProcess)
        // childProcess.unref() // prevent parent from waiting to child process and un reference child from parent's event loop.
        console.log(`\x1b[45m%s\x1b[0m`,`[NODE HOST MACHINE] PID: Child ${childProcess.pid}`)
        childProcess.on('error', function( err ){ throw err })
        childProcess.on('exit', () => {
            console.log(`\x1b[41m%s\x1b[0m`,`[NODE HOST MACHINE] PID: Child ${childProcess.pid} terminated.`)
            spawnSync('docker', [`kill ${containerPrefix}`], { 
                detached: false, shell: true, stdio: 'inherit',
                env: process.env // pass environment variables like process.env.PWD to spawn process
            })    
        })

    }

    // MANAGER APP
    {
        let image = 'myuserindocker/deployment-environment:simple_NodeDockerCompose', // this container should have docker client & docker-compose installed in.
            processCommand = 'docker',
            commandArgument = managerApp.commandArgument,
            containerCommand = `node ${managerApp.absolutePathInContainer} ${commandArgument.join(' ')}`,
            // containerBashCommand = `bash -c "${containerCommandCase1} || ${containerCommandCase2}"`,
            containerPrefix = 'managerApp'
        
        let processArg = [
                `run`,
                `--rm`, // automatically remove after container exists.
                `--interactive --tty`, // allocate a terminal - this allows for interacting with the container process.
                `--volume ${application.hostPath}:${application.pathInContainer}`,
                // `--volume ${managerAppHostPath}:/project/managerApp`,
                `--volume /var/run/docker.sock:/var/run/docker.sock`,
                `--volume ${operatingSystem.homedir()}/.ssh:/project/.ssh`,
                `--network=${networkName}`,
                `-P`,
                `--env applicationPathOnHostMachine=${application.hostPath}`,
                `--env sshUsername=${operatingSystem.userInfo().username}`,
                `--env PWD=${workingDirectoryInContainer}` // pass PWD absolute path as in container (convert host machine path to container path)
            ]
            // .concat(convertObjectToDockerEnvFlag(process.env))  // pass all envrinment variables - causes issues as some variables like `PATH` are related to the executed script
            .concat([
                `--name ${containerPrefix}`,
                `${image}`,
                `${containerCommand}`
            ])
        console.log(
            `%s \n %s \n %s`,
            `\x1b[3m\x1b[2m > ${processCommand} ${processArg.join(' ')}\x1b[0m`,
            `\t\x1b[3m\x1b[2mimage:\x1b[0m ${image}`,
            `\t\x1b[3m\x1b[2mcommand:\x1b[0m ${containerCommand}`
        )    
        
        let childProcess = spawn(processCommand, processArg, { 
            detached: false, shell: true, stdio: [ 'inherit', 'inherit', 'inherit', 'ipc' ],
            env: process.env // pass environment variables like process.env.PWD to spawn process
        })
        childProcessArray.push(childProcess)
        // childProcess.unref() // prevent parent from waiting to child process and un reference child from parent's event loop.
        console.log(`\x1b[45m%s\x1b[0m`,`[NODE HOST MACHINE] PID: Child ${childProcess.pid}`)
        childProcess.on('error', function( err ){ throw err })
        childProcess.on('exit', () => { 
            console.log(`\x1b[41m%s\x1b[0m`,`[NODE HOST MACHINE] PID: Child ${childProcess.pid} terminated.`)
            // if child process exits then remove all other running processes
            killChildProcess()
        })
    }
    
    process.on('SIGINT', () => { // when docker is using `-it` option this event won't be fired in this process, as the SIGINT signal is passed directly to the docker container.
        console.log("• [NODE HOST MACHINE] Caught interrupt signal - host machine level")
        killChildProcess()
    })

    console.groupEnd()
}
