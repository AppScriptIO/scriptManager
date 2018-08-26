const managerApp = require('./managerApp').run

if (require.main === module) { // if executed directly from the command-line
    managerApp().catch(error => {
      console.error(error);
      process.exitCode = 1;
    })
} 

// export anyway - useful when required as a module in another module.
module.exports = {
    runManagerAppInContainerWithClientApp: require('./hostMachineClientEntrypoint').runManagerAppInContainerWithClientApp,
    managerApp
}
  