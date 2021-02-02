#!/usr/bin/node

const Config = require('./lib/configlib.js');
const mxLib = require('./lib/commonlib.js');
const LibraryEntry = require('./lib/elementlib.js');

/**
 * Config File Format
 * A valid JSON format file in the config directory with the following sections
 * directory: directory_of_icon_file       (for both existing and new svg files)
 * library : [
 *    { name : name_of_library_entry       (displayed as name in the UI)
 *      type : original_url_of_svg_file    (reference only, not used)
 *      svg : local_file_name_of_svg_file  (must be in icon directory from config.json, "blank" special case)
 *      file : name_of_create_icon_file    (must be in icon directory from config.json)
 *      color : background_color           (from the color_key provided in the commonconfig.json)
 *    } ]
 * NOTE: the string "blank" for svg is treated specially to create blank icons
 */
let config = new Config('iconconfig.json');

// Templates for each library entry type
config.templates = {
  "Icon": 'Icon_template.xml'
}

class Icon extends LibraryEntry {
  /**
   * Adds a colored rectangle as the first element of the svg image.
   * This allows all other elements to be drawn on top of this rectangle
   */
  generateFile() {
    // create a colored background rectangle
    let colrect = '<rect width="100%" height="100%" fill="' + this.color + '"/>';
    // find the closing bracket of the first <g> tag
    // this will place us as the first item in the image
    let g = this.svg.indexOf(">", this.svg.indexOf("<g")) + 1;
    // insert the colored rectangle
    this.svg = this.svg.slice(0, g) + colrect + this.svg.slice(g);
    this.imageTemplate(this.encodedSVG());
  }
}

mxLib.buildLibrary(new Icon, config);
