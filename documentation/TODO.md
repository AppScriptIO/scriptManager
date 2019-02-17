- [consider this change]: rename `jsCodeToEvaluate` to a term closer to the meaning of instantiating a js exported module. Research for the ways a module could be instantiated, i.e. as an object, or as a function executed directly.

- Allow configurations to be exposed by the `script` repository or module: 
    - Read scripts from node_modules: search for any `script` repositories that comply with the api of the script manager.
    - A configuration file inside the `script` foler/repository or an exposed object will define the default behavior of the script including `scriptConfig.type`, `scriptConfig.adapterFunction`, etc.

    Allowing scripts to simply be installed in the target project and automatically used by `script manager`, without the need to configure each script settings in the target project`s configuration or even adding them as keys in the target project configuration file. Simply install the script and use it.

- 

- Describe better the error of default behavior where the exported script must be a function. The error currently thrown for trying to execute a non function exported object: `TypeError: (0 , _script.source) is not a function`