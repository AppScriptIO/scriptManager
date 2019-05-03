/* Entrypoint chain */
// • Transpilation (babelJSCompiler)
const { Compiler } = require('@dependency/javascriptTranspilation')

let compiler = new Compiler()
compiler.requireHook()
compiler.outputTranspilation()

// • Run
module.exports = require('../../scriptManager/clientInterface/temporary.js')
