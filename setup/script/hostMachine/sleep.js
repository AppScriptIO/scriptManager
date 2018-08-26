// for development to run a container with the the repository as volumes.
import { spawn, spawnSync } from 'child_process'
import path from 'path'
const message_prefix = `\x1b[3m\x1b[2m•[${path.basename(__filename)} JS script]:\x1b[0m`

console.group(`%s \x1b[33m%s\x1b[0m`,`${message_prefix}`,`ƒ sleep - container with volumes`)

let image = 'node:latest',
    containerCommand = 'sleep 1000000',
    processCommand = 'docker',
    containerPrefix = 'sleepmanagerApp',
    applicationHostPath = path.normalize(path.join(__dirname, '../../../'))

let processArg = [
    `run`,
    // `--volume /var/run/docker.sock:/var/run/docker.sock`,
    `--volume ${applicationHostPath}:/project/application`,
    `--volume ${applicationHostPath}:/project/managerApp`,
    `--env hostPath=${applicationHostPath}`,
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

