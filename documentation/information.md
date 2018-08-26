The end result of this repository (i.e. deployment in production) is a docker image that can be used for :
• Building docker images using nodejs scripts. i.e. installing packages, moving files, organizing project files in the container operating system.
• Running other applications in development, and providing environment for deployment also.

directory struction for:
• Intermediate container used for installation and calling dockerfile build through socket:
    - /project
        /application
        /dependency
• Resulted container/image from build:
    - /project
        - /appDeploymentEnvironment
                /application
                /dependency
    (because the production apps that are going to use it will have inside the project folder their own application and dependency folders.)


• The manager app is executed inside a container for the following reasons: 
    - Ease the development of the Nodejs manager app for a specific OS environment.
    - Not to pollute the host OS environment.
    - For a more secure execution, preventing bugs from affecting the host OS.
    - To gain the benifit of controlled container with ability to manipulate folder structure with volumes and create symlinks easily. 