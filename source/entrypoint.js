// if executed directly from the command-line
if (require.main === module) {
    
    require('./managerApp').run().catch(error => {
      console.error(error);
      process.exitCode = 1;
    })

} else {
    
    // export anyway - useful when required as a module in another module.
    module.exports = { // remap exports to subfolders.
        get runManagerAppInContainerWithClientApp() { // getter for isolation of this module, where it is required only if imported. This prevents the entrypoint checks in this module to run each time this file executes.
            return require('./hostMachineClientEntrypoint').runManagerAppInContainerWithClientApp
        },
        managerApp: require('./managerApp').run
    }
    
}

  