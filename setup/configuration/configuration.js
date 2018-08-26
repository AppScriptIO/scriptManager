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

module.exports = {
    projectPath,
    script: {
        hostMachine: {
            path: './setup/script/hostMachine' // relative to applicaiton repository root.
        },
        container: [ // entrypoint configuration map, paths are relative to external app.
            {
                key: 'install',
                path: './setup/script/container/setupOSEnvironmentContainerScript',
            },
            {
                key: 'buildEnvironmentImage',
                path: './setup/script/container/buildEnvironmentImage',
            },
            // {
            //     key: 'buildContainerManager',
            //     path: './setup/script/container/buildContainerManager',
            // },
            {
                key: 'sleep',
                path: (externalAppAppDeploymentLifecycle) ? `${externalAppAppDeploymentLifecycle}/containerScript/sleep` : null,
            }
        ]
    },
    externalApp: {
        rootFolder: externalAppRootFolder,
        entrypointFolder: `${externalAppRootFolder}/setup/script/containerManagerScript`,
        configurationFilePath: `${externalAppRootFolder}/setup/configuration/configuration.js`,
        dependency: {
            appDeploymentLifecycle: externalAppAppDeploymentLifecycle
        }
    },
    managerApp: {
        rootFolder: managerAppRootFolder,
        dependency: {
            appDeploymentLifecycle: `${managerAppRootFolder}/dependency/gitSubmodule/appDeploymentLifecycle`,
        }
    },
    buildEnvironmentImage: {
        dockerComposeVersion: '1.21.2',
        dockerMachineVersion: '0.15.0'
    }
}
