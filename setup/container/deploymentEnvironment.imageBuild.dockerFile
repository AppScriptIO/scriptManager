### Build docker container
### As this is a deployment image - number of layers and subsequently image size doesn't matter.
FROM node:latest
MAINTAINER SZN

ARG PROJECT="/project" 
    ENV PROJECT=${PROJECT}
# ContainerManager
ARG mangerApp_repositoryPath="$PROJECT/managerApp" 
    ENV mangerApp_repositoryPath ${mangerApp_repositoryPath}

# Copy files and make them executable.
# Copy command in dockerfile is relative to the build context specified in docker-compose.
COPY ./ $mangerApp_repositoryPath/
# Apparently when copied from windows, execution permissions should be granted. for sehll scripts.
RUN find $PROJECT/ -type f -iname "*.sh" -exec chmod +x {} \; 

### command for build installation - define defaults, which can be overriden by docker-compose file args.
ARG DEPLOYMENT
    ENV DEPLOYMENT ${DEPLOYMENT}
ARG entrypointConfigurationPath=/project/application/setup/entrypoint/configuration.js
    ENV entrypointConfigurationPath ${entrypointConfigurationPath}
    
# Environment image 'deployment-environment'
    ENV entrypointConfigurationKey install
    ENV externalAppBasePath /project/managerApp
ARG entrypointConfigurationKey=buildEnvironmentImage
    ENV entrypointConfigurationKey ${entrypointConfigurationKey}
ARG dockerImageTag
    ENV dockerImageTag ${dockerImageTag}
ARG dockerImageName
    ENV dockerImageName ${dockerImageName}
RUN echo '(Docker build temporary container: ↓)' && \
    node $mangerApp_repositoryPath/source/

### Define command for runtime. For using container from dockerhub immediately. 
# reset or set defaults of variables
ENV entrypointOption=run
# save runtime command in a executable file inside the container (which will be called on runtime)
RUN printf '#!/bin/bash\nnode $containerManager/source/entrypoint.js $*' > /usr/bin/containerCommand && \
    chmod +x /usr/bin/containerCommand   
# Executed only on runtime.
CMD containerCommand 
