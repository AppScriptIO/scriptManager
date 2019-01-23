# scriptManager
Manages the execution of multiple JS scripts of a target project optionally running them in containers.  Scripts & lookup directories are defined in the target project`s configuration file.
- Allows to pick & execute scripts from target project`s configuration file or lookup for scripts in configured directories. Helps in deployment tasks/scripts (e.g. building docker images and executing commands) in a more manageble way, instead of having to deal with shell scripts/commands.
- Exposes a CLI tool and a visual interface.
- Optionally can run JS scripts in containers.
- 

_Dependencies:_
- _[scriptExecution](https://github.com/AppScriptIO/scriptExecution) module to run the Javascript scripts._
- _[configurationManagement](https://github.com/AppScriptIO/configurationManagement) module to lookup and load configuration file._
____

## Use cases for running `scriptManager` in a container as opposed to on the host machine: 
- Ease the development of `scriptManager` for a specific OS environment (i.e. Linux).
- Not to pollute the host OS environment.
- For a more secure execution, preventing bugs from affecting the host OS & filesystem outside the target project`s root.
- To gain the benifit of controlled container with ability to manipulate folder structure with volumes and create symlinks easily. 
