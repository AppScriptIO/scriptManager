const path = require('path')

const ownConfiguration = { // own project's configuration
    directory: {
        application: {
            rootPath: path.normalize(`${__dirname}/..`)
        }
    },
    script: [],
}

const functionalityConfig = { // the configuration affecting the behavior of source code module of this project.
    targetApp: {
        configurationBasePath: ['./configuration' ]
    },
    get containerSetting() { // ⚗ refactor when fixing `runInContainer` functionality. 
        const projectPath = "/project",
        scriptManagerRootFolder = `${projectPath}/scriptManager`,        
        targetAppRootFolder = process.env.targetAppBasePath || `${projectPath}/application`;

        // try to find module in targetApp
        let targetAppDeploymentScript;
        try {
            targetAppDeploymentScript = path.dirname( require.resolve(`@dependency/DeploymentScript/package.json`, { paths: [ targetAppRootFolder ] }) )  
        } catch (error) {
            // console.log(`• Cannot find DeploymentScript module in target app.`)
            targetAppDeploymentScript = null
        } 

        return {
            targetApp: {
                rootFolder: targetAppRootFolder,
                scriptFolder: `${targetAppRootFolder}/script`,        
            }
        }
    }
}

module.exports = Object.assign(
    ownConfiguration,
    functionalityConfig
)
