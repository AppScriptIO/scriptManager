/** Setup environment entrypoint - node runtime setup on entrypoint */
import path from 'path'
import { addModuleResolutionPathMultiple } from '@dependency/addModuleResolutionPath'
import { moduleScopePattern } from '@dependency/moduleScopePattern'

export async function setupEnvironment() {
    
    const rootPath = `${__dirname}/../../..`,
          jsEntrypointPath = path.dirname(require.main.filename)

    /* setup module scope symlink */
    await moduleScopePattern({
        rootPath, 
        rootScopeModulePath: `${jsEntrypointPath}/node_modules/@root`, 
        rootFolderArray: [ 'setup' ]
    })

    /* add source folder to resolution path */
    addModuleResolutionPathMultiple({ pathArray: [ jsEntrypointPath ] })

}