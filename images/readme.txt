Contains images used for our libraries, design time and not deployed with tooling.

IconLibrary
-----------
The images are generated based on the contents of the iconconfig.json file.
The configuration options are as follows:
   directory: directory_of_icon_file       
Used for both source and generated svg files. Relative or absolute paths can be used.

   colors : { 
      color_key: hex_value
   }
Maps color keys to hex values. The color_key is any valid string. The hex_value is a valid #FFFFFF formatted color code.

   library : [
      { name : name_of_library_entry       (displayed as name in the UI)
        url : original_url_of_svg_file     (reference only, not used)
        svg : local_file_name_of_svg_file  (must be in icon directory from config.json, "blank" special case)
        icon : name_of_create_icon_file    (must be in icon directory from config.json)
        color : background_color           (from the color_key provided in the config.json)
      } ]
This is the main mapping of svg images into the icon library. Images will be processed in the order listed in this
   section.
Name is the displayed name in the UI of draw.io.
URL is for reference only. It is not used for anything. As a best practice, provide a URL to the original source svg
   file.
SVG is the local file name of the source svg file. This file will be looked for in the "directory" location provided
   previously.
   NOTE: the string "blank" is treated specially to create blank icons.
Icon is the local file name of the generated svg file. This file will be written in the "directory" location provided
   previouly.
Color is a color_key from the list of colors provided previously.

Processing of the icon library is as follows:
 1. If the provided svg file is found, that source file will be composited with the provided color background to
    generate a new icon.
 2. If the provided svg file is not found, but a previously generated icon file is found, then the previously generated
    icon file will be used. The background of the previous icon file will be changed to the color background provided.
 3. If neither the svg file nor a previous icon file is found, then the program will error and terminate.
This processing order allows new icons to be generated from svg files or for existing icon files to be
"re-backgrounded" using existing icon files. In all cases, if the on-disk file format of the generated icon files does
not change from the previous icon file, no new icon file will be generated. This is done to prevent unnecessarily
churning icon file changes into git.
