#!/usr/bin/node

const Config = require('./lib/configlib.js');
const mxLib = require('./lib/commonlib.js');
const LibraryEntry = require('./lib/elementlib.js');

/**
 * Config File Format
 * A valid JSON format file with the following sections
 * directory: directory_of_logical_files   (for both existing and new files)
 * library : [
 *    { name : name_of_library_entry       (displayed as name in the UI)
 *      type : type_of_library_entry       (used to determine the type of entry built)
 *      file : name_of_created_file        (must be in directory from config.json)
 *      color : color_for_element          (from the color_key provided in the commonconfig.json)
 *    } ]
 */
let config = new Config('logicalconfig.json');

// Templates for each library entry type
config.templates = {
  "ControlPlane": 'ControlPlane_template.xml',
  "GroupBox": 'GroupBox_template.xml',
  "Service": 'Service_template.xml',
  "ServiceDetail": 'Service_with_detail_template.xml'
}

class Logical extends LibraryEntry {
  /**
   * All of the various templates in this library have a #CCCCCC
   * background color. So we replace it as needed.
   */
  generateFile () {
    this.reColorTemplate('#CCCCCC');
  }
}

mxLib.buildLibrary(new Logical, config);
