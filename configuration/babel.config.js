const configuration = require('./configuration.js'),
  { getBabelConfig } = require('@dependency/javascriptTranspilation')

module.exports = getBabelConfig(configuration.transpilation.babelConfigKey, { configType: 'functionApi' })
