import { spawn, spawnSync } from 'child_process'
import operatingSystem from 'os'
import path from 'path'
import slash from 'slash'

const containerPath = { // defined paths of volumes inside container.
    application: '/project/application'
}

export function runManagerAppInContainerWithClientApp({
    applicationHostPath,
    // as default the managerApp should be installed (i.e. expected to be a dependency) as a dependency in a nested folder to the application.
    managerAppHostPath
}) {
    let managerRelativePathFromApplication = path.relative(applicationHostPath, managerAppHostPath)
    managerRelativePathFromApplication = slash(managerRelativePathFromApplication) // convert to Unix path from Windows path (change \ slash to /)
    // NOTE: creating an absolute path for managerApp assumes that the module exist under the application directory (/project/application).
    let managerAbsolutePathInContainer = slash(path.join(containerPath.application, managerRelativePathFromApplication)) // create an absolute path for managerApp which should be nested to application path.

    let image = 'node:latest',
        processCommand = 'docker',
        commandArgument = process.argv.slice(3), // remove first 2 commands - "<binPath>/node", "<path>/entrypoint.js" and the third host machine script name "containerManager"
        containerCommand = `node ${managerAbsolutePathInContainer} ${commandArgument.join(' ')}`,
        // containerBashCommand = `bash -c "${containerCommandCase1} || ${containerCommandCase2}"`,
        containerPrefix = 'managerApp'
    
    let processArg = [
        `run`,
        `--rm`, // automatically remove after container exists.
        `--volume ${applicationHostPath}:/project/application`,
        // `--volume ${managerAppHostPath}:/project/managerApp`,
        `--volume /var/run/docker.sock:/var/run/docker.sock`,
        `--volume ${operatingSystem.homedir()}/.ssh:/project/.ssh`,
        `--env hostPath=${applicationHostPath}`,
        `--env sshUsername=${operatingSystem.userInfo().username}`,
        `--name ${containerPrefix}`,
        `${image}`,
        `${containerCommand}`
    ]
    
    console.log(
        `%s \n %s \n %s`,
        `\x1b[3m\x1b[2m > ${processCommand} ${processArg.join(' ')}\x1b[0m`,
        `\t\x1b[3m\x1b[2mimage:\x1b[0m ${image}`,
        `\t\x1b[3m\x1b[2mcommand:\x1b[0m ${containerCommand}`
    )    
    
    let cp = spawn(processCommand, processArg, { detached: false, shell: true, stdio: [0,1,2] })
    cp.on('error', function( err ){ throw err })
    cp.unref() // prevent parent from waiting to child process and un reference child from parent's event loop.
    console.groupEnd()
}    
