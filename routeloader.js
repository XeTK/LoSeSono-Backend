// Resources used to create this dynamic loader.
// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route
// https://gist.github.com/kethinov/6658166
// https://github.com/XeTK/JSBot/blob/master/loader.js

// Import some stuff todo with file management and building paths.
var fs          = require('fs');
var path_module = require('path');

// Store for all the routes we load.
var route_holder = {};

// Build the path to the routes directory, making it not OS dependent.
var path = path_module.join(__dirname, 'routes');

// Post the path to the console that everyone knows where it is.
console.log('Routes path: ' + path.yellow);

// Function to read the whole directory tree from a specific part.
var walkSync = function(dir, filelist) {

    // Read all the files in the current directory we are working on.
    var files = fs.readdirSync(dir);

    // Add a new array onto the file list ready to add the next bunch of files.
    filelist = filelist || [];

    // For all the items we find in the directory.
    files.forEach(
        function(file) {

            // Build the whole path for a given file.
            var iPath = path_module.join(dir, file);

            // Check if the item is a directory.
            if (fs.statSync(iPath).isDirectory()) {
                // We start this all over again and get all the files in the directory.
                filelist = walkSync(iPath + '/', filelist);
            } else {
                // Push the files onto the file list.
                filelist.push(iPath);
            }
        }
    );

    // Return the file list that we just built.
    return filelist;
}; 

// Start reading the files in the routes directory.
var files = walkSync(path + '/');

// For each file we need to load them dynamically.
files.forEach(
    function(file) {
        
        // Regex we need to check the files are valid for loading.
        var regex = /\.js$/g;

        // If the file is valid and we can load it then we do.
        if (regex.test(file)) {
            // Give some dialog to the user so they can see what file has been loaded.
            console.log(('Loading route: ' + file).green);
            // Load the file using require into the application.
            require(file)(route_holder);
        } else {
            // If its not valid we discard it.
            console.log(('Not route: ' + file).red);
        }
    }
);

// Return the list of plugin's that have been loaded.
exports.route_holder = route_holder;