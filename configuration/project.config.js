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
  },
  entrypoint: {
    programmaticAPI: './script.js',
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

module.exports = Object.assign(ownConfiguration)
