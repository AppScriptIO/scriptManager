const projectConfig = require('../../configuration/project.config.js'),
  path = require('path'),
  filesystem = require('fs')

// • Run
if (filesystem.existsSync(projectConfig.directory.distribution)) {
  module.exports = require(projectConfig.directory.distribution)
} else {
  // • Transpilation (babelJSCompiler)
  const { Compiler } = require('@dependency/javascriptTranspilation')
  let compiler = new Compiler()
  compiler.requireHook()
  compiler.outputTranspilation()
  module.exports = require(path.join(projectConfig.directory.source, projectConfig.entrypoint.programmaticAPI))
}
