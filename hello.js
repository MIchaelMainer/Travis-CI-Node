/// <reference path="typings/main/ambient/node/node.d.ts"/>

(function () {

    var fs = require('fs');
    var glob = require('glob');

    var filesArray = glob.sync("*.md", { matchBase: true });

    readEachFileInRepo(filesArray);

})();

// Access each file name and then read the contents of the file.
function readEachFileNameInRepo(files) {
    // Access the file name of each file in the repo.
    for (var f = 0; f < files; f++) {

        // Read the contents of each file and get the links
        readFile(files[f]);
    }
}

// Read the file and then call to read all of the lines.
function readFile(file) {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(file)
    });

    readLines(lineReader);
}

// Read all of the lines in the linereader (1 file).
function readLines(lineReader) {
    var lineCount = 1;

    // Read a line and check whether there are one or more markdown links in the line.
    lineReader.on('line', function (line) {

        var arrayOfLinks = line.match(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?([ \t]*)((['"])(.*?)\6[ \t]*)?\))/g);
        // from http://stackoverflow.com/questions/11404013/regular-expressions-with-javascript-replace-a-particular-submatch-group-with-so

        // Check whether there are any matches for a link on the line.
        // True if there are one or more links in this line.
        if (arrayOfLinks) {

            // Access each link in the line.
            for (var i = 0; i < arrayOfLinks.length; i++) {

                // Here we call a function that checks that each link is valid.
                // We check relative links for existence in our file list.
                // If the link starts with http or https, follow link and see if we get 200 or not.
                // What to do if the linked file is not an .md
                // console.log(lineCount, arrayOfLinks[i]);

                testMarkdownLink(lineCount, arrayOfLinks[i]);
            }
        }
        lineCount++;
    });
}

function testMarkdownLink(linenumber, link) {

    // Gets the link in form '(xxxx.md)' or '(https://xxxx.com)'. Need to update this regex.
    var almostLink = link.match(/\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?([ \t]*)((['"])(.*?)\6[ \t]*)?\)/i);

    // Trim the first and last chars, (, ).
    almostLink = almostLink.slice(1);
    almostLink = almostLink.slice(0, -1);

    // Now we have the link content. Now we need to determine which type of link it is.

    // If the file is an .md file, check whether that file exists in our array of file names. If it exists,
    // and the path is the same, then we can skip this as that is a valid link.

    // Is the link a web address.
}

function logBadLink() {

}


// var marked = require('marked');

// marked.setOptions({ gfm: true });

// This will get me all of the md files in a repo (including those in a node_modules. I could use this
// to create a script thatloads all of these files, and then checks them for broken links.
//https://github.com/isaacs/node-glob

// The glob may need to support all files.

// glob("*.md", { matchBase: true }, function (err, files) {
//     console.log(files);
// });

// var filesArray = glob.sync("(*.md|*.gif|*.png)", { matchBase: true });

//console.log(filesArray);

// // Access the file name of each file in the repo.
// for (var f = 0; f < filesArray; f++) {

//     // Read the file contents
// }

// var fileContents;

// fs.readFile('./README.md', function (err, data) {
//     fileContents = new Buffer(data).toString();

// This gives us access to the results of a parser.
// https://github.com/chjj/marked

// var tokens = marked.lexer(fileContents);
// console.log(marked.parser(tokens));

// var lexer = new marked.Lexer();
// var tokens = lexer.lex(fileContents);
// console.log(tokens);
// console.log(lexer.rules);
// });


// THIS READS EACH LINE IN A FILE. GETS US LINE NUMBER FOR REPORTING ERRORS.
// var lineReader = require('readline').createInterface({
//     input: require('fs').createReadStream('./README.md')
// });

// var lineCount = 1;


// lineReader.on('line', function (line) {

//     // var arrayOfLinks = line.match( /\[([^\]]+)\]\(([^)"]+)(?: \"([^\"]+)\")?\)/g );
//     var arrayOfLinks = line.match(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?([ \t]*)((['"])(.*?)\6[ \t]*)?\))/g);
//     // from http://stackoverflow.com/questions/11404013/regular-expressions-with-javascript-replace-a-particular-submatch-group-with-so


//     // Check whether there are any matches for a link on the line.
//     if (arrayOfLinks) {


//         for (var i = 0; i < arrayOfLinks.length; i++) {

//             // Here we call a function that checks that each link is valid.
//             // We check relative links for existence in our file list.
//             // If the link starts with http or https, follow link and see if we get 200 or not.
//             // What to do if the linked file is not an .md
//             console.log(lineCount, arrayOfLinks[i]);
//         }

//         // console.log(lineCount, line);
//         // console.log(lineCount, arrayOfLinks);
//     }

//     // console.log(lineCount, line);
//     lineCount++;
// });

// NOW WE NEED TO CHECK EACH LINK IN EACH LINE.
// There can be multiple links in each line.