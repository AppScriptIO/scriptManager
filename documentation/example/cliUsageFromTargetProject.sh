# Using `scriptManager` from inside a target project that would have it installed
# relative to project`s root.
node ./node_modules/@dependency/appDeploymentManager/source/entrypoint/cliAppManager/transpilation.entrypoint.js scriptKeyToInvoke=moduleExample
# OR
yarn run scriptManager scriptKeyToInvoke=moduleExample