module.exports = Object.assign({ // remap exports to subfolders.
        get runInContainer() { // getter for isolation of this module, where it is required only if imported. This prevents the entrypoint checks in this module to run each time this file executes. i.e. run on-demand only.
            return require('./runInContainer')() // returns a function
        },
    },
    require('./scriptManager')
)