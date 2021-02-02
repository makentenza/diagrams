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
 *      type : type_of_library_entry       (used to determine the type of element built)
 *      svg : local_file_name_of_svg_file  (must be in directory from config.json)
 *      file : name_of_created_file        (must be in directory from config.json)
 *      color : color_for_element          (from the color_key provided in the config.json)
 *    } ]
 * NOTE: svg or color could be blank based on the type as they ae not used for certain types of elements.
 */
let config = new Config('schematicconfig.json');

// Templates for each library entry type
config.templates = {
  "Element": 'Element_template.xml',
  "Node": 'Node_template.xml',
  "StorageElement": 'StorageElement_template.xml',
  "StorageNode": 'StorageNode_template.xml',
  "BoxOpaque": 'BoxOpaque_template.xml',
  "BoxTransparent": 'BoxTransparent_template.xml',
  "Network": 'Network_template.xml',
  "Data": 'Data_template.xml',
  "Callout": 'Callout_template.xml',
  "CalloutImage": 'Image_template.xml',
  "Image": 'Image_template.xml'
}

class Schematic extends LibraryEntry {
  /**
   * Based on the type, recolor the svg used for the element and then place it
   * in it's template. Some also have lables applied to the template.
   */
  generateFile () {
    // determine the type of file
    switch(this.type) {
    case "Element":
      this.imageTemplate(this.encodedSVG());
      break;
    case "Node":
      this.imageTemplate(this.encodedSVG());
      break;
    case "StorageElement":
      this.imageTemplate(this.encodedSVG());
      break;
    case "StorageNode":
      this.imageTemplate(this.encodedSVG());
      break;
    case "BoxOpaque":
      this.reColorTemplate('#FFFFFF');
      this.labelTemplate(this.name);
      break;
    case "BoxTransparent":
      this.reColorTemplate('#FFFFFF');
      this.labelTemplate(this.name);
      break;
    case "Network":
      this.reColorTemplate('#FFFFFF');
      this.labelTemplate(this.name);
      // set width and height manually
      this.width = 140;
      this.height = 1;
      break;
    case "Data":
      this.reColorTemplate('#FFFFFF');
      this.labelTemplate(this.name);
      // set width and height manually
      this.width = 140;
      this.height = 1;
      break;
    case "Callout":
      this.reColorTemplate('#FFFFFF');
      break;
    case "CalloutImage":
      this.imageTemplate(this.encodedSVG());
      // Callout images have no label
      this.labelTemplate('');
      break;
    case "Image":
      this.imageTemplate(this.encodedSVG());
      this.labelTemplate(this.name);
      break;
    default:
      throw new Error("Invalid type for for entry <" + this.name + ">");
    }
  }
}

mxLib.buildLibrary(new Schematic, config);
