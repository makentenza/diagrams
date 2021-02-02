/**
 * Common library element object
 * @param {object} entry      JSON object entry read from library config
 * @param {object} config     Config object from common config
 *
 * For the entry object: name, type, and filename are required. All other items are optional. 
 */

class LibraryEntry {
  constructor(entry, config) {
    this.name = '';          // displayed in the UI (required)
    this.type = '';          // type if library entry (required)
    this.filename = '';      // where the current file is/will be stored (required)
    this.svg = '';           // image for use in the element (optional)
    this.existingfile = '';  // used to compare if the file changed
    this.color ='';          // color of the element (optional)
    this.templatefile = '';  // template used to create the element (optional)
    this.newfile ='';        // the newly created element
    this.width = 0;          // used to set shape size on canvas
    this.height = 0;         // used to set shape size on canvas
  }

/**
 * Sets up the object with information from the json entry and the configuration.
 * This would normally be done in the constructor, but we re-use the library element 
 * object, so this function sets it up with new data.
 */
  setup (entry, config) {
    let mxLib = require('./commonlib.js');

    this.name = entry.name;
    this.type = entry.type;
    this.filename = config.directory + entry.file;
    
    // Load svg file or empty by default
    if (entry.svg) {
      this.svg = this.getSVGFile(config.directory + entry.svg);
    } else {
      this.svg = '';
    }

    // Load existing file
    this.existingfile = this.getExistingFile(this.file);

    // Set the color to the corresponding hex code or white by default
    if (entry.color) {
      this.color = config.colors[entry.color];
    } else {
      this.color ='#FFFFFF';
    }

    // Set template based on type
    this.templatefile = mxLib.readFileClean(config.templatedir + config.templates[this.type]);
    
    // Default empty new file
    this.newfile ='';
    
    // Default width and height
    this.width = 0;
    this.height = 0;
  }
  
  /**
   * Reads in the existing file
   * @param  {string} file     The file name of the existing file
   * @return {string}          The existing file or null
   */
  getExistingFile (name) {
    let fs = require('fs');
    let mxLib = require('./commonlib.js');
    if (fs.existsSync(name)) {
    	try {
        return mxLib.readFileClean(name);
      }
      catch (e) {
        throw new Error('Error reading existing file: ' + e);
      }
    } else {
      return '';
    }
  }

  /**
   * Reads in the svg file
   * @param  {string} file     The file name of the svg file
   * @return {string}          The svg file or null
   */
  getSVGFile (name) {
    let fs = require('fs');
    let mxLib = require('./commonlib.js');
    if (fs.existsSync(name)) {
    	try {
        return mxLib.readFileClean(name);
      }
      catch (e) {
        throw new Error('Error reading svg file: ' + e);
      }
    } else {
      return '';
    }
  }

  /**
   * Encodes the svg file to be included in an element entry
   * @return {string}          An encoded image file
   */
  encodedSVG () {
    return Buffer.from(this.svg, 'utf-8').toString('base64');
  }

  /**
   * Using the svg as a base, replaces the passed color code with 
   * the element color code.
   * @param  {string} oldcolor The color code to be replaced (#FFFFFF format)
   */
  reColorSVG (oldcolor) {
    let regex = new RegExp(oldcolor, 'gi');
    this.svg = this.svg.replace(regex, this.color);
  }

  /**
   * Using the template as a base, replaces the passed color code with 
   * the element color code.
   * @param  {string} oldcolor The color code to be replaced (#FFFFFF format)
   *
   * NOTE: if we are already have a populated newfile, apply the change there
   */
  reColorTemplate (oldcolor) {
    let regex = new RegExp(oldcolor, 'gi');
    if (this.newfile) {
      this.newfile = this.newfile.replace(regex, this.color);
    } else {
      this.newfile = this.templatefile.replace(regex, this.color);
    }    
  }

  /**
   * Using the template as a base, replaces the tag ##IMAGE## with
   * the encoded svg.
   *
   * NOTE: if we are already have a populated newfile, apply the change there
   */
  imageTemplate (image) {
    let regex = new RegExp('##IMAGE##', 'gi');
    if (this.newfile) {
      this.newfile = this.newfile.replace(regex, image);
    } else {
      this.newfile = this.templatefile.replace(regex, image);
    }
  }

  /**
   * Using the template as a base, replaces the tag ##IMAGE## with
   * the encoded svg.
   *
   * NOTE: if we are already have a populated newfile, apply the change there
   */
  labelTemplate (label) {
    let regex = new RegExp('##LABEL##', 'gi');
    if (this.newfile) {
      this.newfile = this.newfile.replace(regex, label);
    } else {
      this.newfile = this.templatefile.replace(regex, label);
    }
  }

  /**
   * Gets the width of the element from the newfile
   * @return {int}             The width of the element
   */
  getWidth () {
    if (this.width) {
      return this.width;
    } else {
      return this.newfile.match(/width="\d+"/)[0].match(/\d+/)[0];
    }
  }
  
  /**
   * Gets the height of the element from the newfile
   * @return {int}             The height of the element
   */
  getHeight () {
    if (this.height) {
      return this.height;
    } else {
      return this.newfile.match(/height="\d+"/)[0].match(/\d+/)[0];
    }
  }

  /**
   * Writes out the newfile or svg, if it has been modified,
   * based on filename extension.
   * This limits changes to timestamps on files that do not 
   * have content changes to avoid churning them.
   */
  writeFileModified () {
    let fs = require('fs');
    let oldfile = '';
    let newfile = '';
    if (fs.existsSync(this.filename)) {
      try {
        oldfile = fs.readFileSync(this.filename).toString();
      }
      catch (e) {
        throw new Error('Error reading old file: ' + e);
      }
    }
    if (this.filename.endsWith('svg')) {
      newfile = this.svg;
    } else if (this.filename.endsWith('xml')) {
      newfile = this.newfile;
    } else {
      throw new Error('Invalid filename (not .xml or .svg)');
    }
    if (newfile != oldfile) {
      try {
        fs.writeFileSync(this.filename, newfile);
      }
      catch (e) {
        throw new Error('Error writing new file: ' + e);
      }
    }
  }
  
/**
 * Creates a library entry for an element.
 * Writes out a modified file before it returns the library entry.
 * @return {string}          The library entry in JSON format
 *
 * NOTE: The element string is deflated before being added to the library
 */
  mxLibraryEntry () {
    this.writeFileModified();
    let zlib = require('zlib');
    let metadata = {"w" : this.getWidth, "h" : this.getHeight, "aspect" : "fixed", "title" : this.name };
    return JSON.stringify(Object.assign({xml: zlib.deflateRawSync(this.newfile).toString('base64'),}, metadata));
  }
}

module.exports = LibraryEntry;
