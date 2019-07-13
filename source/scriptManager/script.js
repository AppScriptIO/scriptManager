import filesystem from 'fs'
import path from 'path'
import { execute, lookup } from '@dependency/scriptExecution'
import { Project } from './Project.class.js'
import { Compiler } from '@dependency/javascriptTranspilation'

process.on('SIGINT', () => {
  console.log('Caught interrupt signal - scriptManager container level')
  process.exit(0)
})

export async function scriptManager({
  targetProjectConfigPath, // configuration object of the target project.
  scriptKeyToInvoke, // the key name for the script that should be executed (compared with the key in the configuration file.)
  jsCodeToEvaluate, // js to evaluate on the required script => 'require(<scriptPath>)<evaluate js>'
  shouldCompileScript = false, // compile using the target projects's configuration files.
}) {
  console.assert(scriptKeyToInvoke, '\x1b[41m%s\x1b[0m', '❌ `scriptKeyToInvoke` parameter must be set.')

  let project = new Project({ configurationPath: targetProjectConfigPath })

  // load entrypoint configuration and check for 'entrypoint' key (entrypoint key holds object with entrypoint information like file path mapping)
  let scriptConfigArray = project.configuration['script']
  console.assert(scriptConfigArray, '\x1b[41m%s\x1b[0m', `❌ config['script'] option in targetProject configuration must exist.`)

  let scriptConfiguration = await lookup({
    script: scriptConfigArray,
    projectRootPath: project.configuration.rootPath,
    scriptKeyToInvoke,
  }).catch(error => {
    throw error
  })

  if (shouldCompileScript) {
    let compiler = new Compiler({ babelTransformConfig: project.configuration.configuration.transpilation.babelConfig /** Search for configuration files from target project */ })
    compiler.requireHook({ restrictToTargetProject: false /* Transpile files of the target project */ })
    // process.on('exit', () => {
    //   console.log(compiler.loadedFiles.map(value => value.filename))
    //   console.log(compiler.babelRegisterConfig.ignore)
    // })
  }

  await execute({
    // Assuming script is synchronous
    scriptConfig: scriptConfiguration,
    jsCodeToEvaluate,
    parameter: {
      api: {
        project: project, // passed to the executed target script.
      }, // pass project api
    },
  }).catch(error => {
    console.error(error)
  })
}
