#!/usr/bin/node

const Config = require('./lib/configlib.js');
const mxLib = require('./lib/commonlib.js');
const LibraryEntry = require('./lib/elementlib.js');

/**
 * Config File Format
 * A valid JSON format file with the following sections
 * directory: directory_of_detail_files    (for both existing and new files)
 * library : [
 *    { name : name_of_library_entry       (displayed as name in the UI)
 *      type : type_of_library_entry       (used to determine the type of entry built)
 *      svg : local_file_name_of_svg_file  (must be in directory from config.json)
 *      file : name_of_created_file        (must be in directory from config.json)
 *      color : color_for_element          (from the color_key provided in the commonconfig.json)
 *    } ]
 * NOTE: file could be an xml or svg file depending on the type of element
 */
let config = new Config('detailconfig.json');

// Templates for each library entry type
config.templates = {
  "DetailElement": 'DetailElement_template.xml',
  "DetailNetwork": 'DetailNetwork_template.xml'
}

class Detail extends LibraryEntry {
  /**
   * Recolor the svg used for this element and then place it
   * in it's template. 
   */
  generateFile (entry) {
    this.reColorSVG('#CCCCCC');
    this.imageTemplate(this.encodedSVG());
  }
}

mxLib.buildLibrary(new Detail, config);
