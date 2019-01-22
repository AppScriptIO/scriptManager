const path = require('path')
const   projectPath = "/project",
        managerAppRootFolder = `${projectPath}/managerApp`,        
        externalAppRootFolder = process.env.externalAppBasePath || `${projectPath}/application`;

// try to find module in externalApp
let externalAppAppDeploymentLifecycle;
try {
    externalAppAppDeploymentLifecycle = path.dirname( require.resolve(`@dependency/appDeploymentLifecycle/package.json`, { paths: [ externalAppRootFolder ] }) )  
} catch (error) {
    // console.log(`• Cannot find appDeploymentLifecycle module in external app.`)
    externalAppAppDeploymentLifecycle = null
} 

module.exports = Object.assign(
    { // own project's configuration
        projectPath,
        directory: {
            rootPath: path.normalize(`${__dirname}/..`)
        },
        script: {
            hostMachine: {
                path: './script/hostMachine' // relative to applicaiton repository root.
            },
            container: [ // entrypoint configuration map, paths are relative to external app.
                {
                    key: 'install',
                    path: './script/container/setupOSEnvironmentContainerScript',
                },
                {
                    key: 'buildEnvironmentImage',
                    path: './script/container/buildEnvironmentImage',
                },
                // {
                //     key: 'buildContainerManager',
                //     path: './script/container/buildContainerManager',
                // },
                {
                    key: 'sleep',
                    path: (externalAppAppDeploymentLifecycle) ? `${externalAppAppDeploymentLifecycle}/containerScript/sleep` : null,
                }
            ]
        },
    },
    { // the configuration affecting the behavior of source code module of this project.
        externalApp: {
            rootFolder: externalAppRootFolder,
            entrypointFolder: `${externalAppRootFolder}/script`,
            configurationFilePath: `${externalAppRootFolder}/configuration/configuration.js`,
            dependency: {
                appDeploymentLifecycle: externalAppAppDeploymentLifecycle
            }, 
            configurationBasePath: ['./configuration' ]
        },
        managerApp: {
            dependency: {
                appDeploymentLifecycle: `${managerAppRootFolder}/dependency/gitSubmodule/appDeploymentLifecycle`,
            }
        }
    }
)
