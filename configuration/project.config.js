const path = require('path')
const resolvedModule = {
  get deploymentScript() {
    return path.dirname(require.resolve(`@dependency/deploymentScript/package.json`))
  },
}

const ownConfiguration = {
  // own project's configuration
  directory: {
    root: path.resolve(`${__dirname}/..`),
    get source() {
      return path.join(ownConfiguration.directory.root, './source')
    },
    get distribution() {
      return path.join(ownConfiguration.directory.root, './distribution')
    },
    // get compiled() {
    //   return path.join(ownConfiguration.directory.root, './distribution')
    // }
  },
  entrypoint: {
    programmaticAPI: './entrypoint.js',
    cli: './scriptManager/clientInterface/commandLine.js',
  },
  script: [
    {
      type: 'directory',
      path: `${resolvedModule.deploymentScript}/script`,
    },
    {
      type: 'directory',
      path: './script/',
    },
  ],
  transpilation: {
    babelConfigKey: 'serverRuntime.BabelConfig.js',
    get babelConfig() {
      const { getBabelConfig } = require('@dependency/javascriptTranspilation')
      return getBabelConfig(ownConfiguration.transpilation.babelConfigKey, { configType: 'json' })
    },
  },
}

const functionalityConfig = {
  // the configuration affecting the behavior of source code module of this project.
  targetApp: {
    configurationBasePath: ['./configuration'],
  },
  get containerSetting() {
    // ⚗ refactor when fixing `runInContainer` functionality.
    const projectPath = '/project',
      scriptManagerRootFolder = `${projectPath}/scriptManager`,
      targetAppRootFolder = process.env.targetAppBasePath || `${projectPath}/application`

    // try to find module in targetApp
    let targetAppDeploymentScript
    try {
      targetAppDeploymentScript = path.dirname(require.resolve(`@dependency/DeploymentScript/package.json`, { paths: [targetAppRootFolder] }))
    } catch (error) {
      // console.log(`• Cannot find DeploymentScript module in target app.`)
      targetAppDeploymentScript = null
    }

    return {
      targetApp: {
        rootFolder: targetAppRootFolder,
        scriptFolder: `${targetAppRootFolder}/script`,
      },
    }
  },
}

module.exports = Object.assign(ownConfiguration, functionalityConfig)
