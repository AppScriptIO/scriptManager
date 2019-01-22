module.exports = { // remap exports to subfolders.
    get runManagerAppInContainerWithClientApp() { // getter for isolation of this module, where it is required only if imported. This prevents the entrypoint checks in this module to run each time this file executes. i.e. run on-demand only.
        return require('./runInContainer').runManagerAppInContainerWithClientApp
    },
    managerApp: require('./appManager').run
}