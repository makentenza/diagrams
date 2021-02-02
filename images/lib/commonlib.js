/**
 * Reads in the file given and removes excess spaces, tabs,
 * newlines, and returns. This allows templates and other files
 * to be kept in easier for humans to read formats for editing
 * but compresses them for use in the tooling.
 * @param  {string} name     Full path and name to read in
 * @return {string}          The file contents cleaned
 */
function readFileClean (name) {
  let fs = require('fs');
  if (fs.existsSync(name)) {
  	try {
      return fs.readFileSync(name).toString()
    	         .replace(/(\r\n|\n|\r)/gm,"").replace(/\s\s/g,"");
    }
    catch (e) {
      throw new Error('Error reading file: ' + e);
    }
  } else {
    throw new Error('File not found: ' + name);
  }
}

/**
 * Iterates over each library entry creates files as needed. 
 * Creates the mxLibraryEntry for each entry and then returns the final mxLibrary.
 * @param {object} config     Config object from common config
 * @param {object} entry      JSON object entry read from library config
 */
function buildLibrary (element, config) {
  let libraryentries = [];
  for (i in config.library) {
    element.setup(config.library[i], config)
    element.generateFile();
    libraryentries.push(element.mxLibraryEntry()); 
  }
  console.log('<mxlibrary>[' + libraryentries.join(',') + ']</mxlibrary>');
}

module.exports = {
  readFileClean,
  buildLibrary
}
