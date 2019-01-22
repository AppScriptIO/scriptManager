import { Configuration } from '@dependency/configurationManagement'

export class Application {

    constructor({
        configurationPath = {}
    }) {
        let configurationObject = require(configurationPath) // load configuration of the application
        this.configuration = new Configuration({ configuration: configurationObject }) // create an instance that follows the `Configuration` specification.
        return this
    }
}