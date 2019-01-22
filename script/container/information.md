# A node module as an entrypoint in a node container, which will assist on deployment of container (install programs and build image).

Currently this entrypoint is reached by build dockerfile assignning environment variable 'entrypointConfigurationKey'
Nodejs app that helps in building docker images and executing commands in a more manageble way, instead of having to deal with shell script or managing shell commands.