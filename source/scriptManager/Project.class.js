import { Configuration } from '@dependency/configurationManagement'

//TODO: move this function to Configuration module.
export class Project {
  constructor({ configurationPath = {} }) {
    let configurationObject = require(configurationPath) // load configuration of the project
    this.configuration = new Configuration({ configuration: configurationObject }) // create an instance that follows the `Configuration` specification.
    return this
  }
}
