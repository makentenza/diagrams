/**
 * Common configuration object for all libraries 
 * @param {string} file    Library specific config file (only filename required)
 *
 * Common config file format is:
 * colors {
 *   name : #hex_code      (hex codes must be valid #FFFFFF format)
 * }
 */
class Config {
  constructor(file) {
    let fs = require('fs');
    
    // read in the library specific config file
    // NOTE: the check is relative to this file location
    // NOTE: the require is relative to the executing script  
    if (fs.existsSync('./config/' + file)) {
      try {
        this.configfile = require('../config/' + file);
      }
      catch (e) {
        throw 'Error reading config file: ' + e;
      }
    } else {
      throw 'Error reading config file: ' + file;
    }

    // directory for library files
    this.directory = this.configfile.directory;
    // directory for template files
    this.templatedir = this.configfile.directory + 'templates/';
    // actual library definition
    this.library = this.configfile.library

    // read in common config file
    // NOTE: the require is relative to the executing script
    this.commonconfigfile = require('../config/commonconfig.json');
    // color dictionary
    this.colors = this.commonconfigfile.colors;
  }
}

module.exports = Config;
