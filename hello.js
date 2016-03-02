/// <reference path="typings/main/ambient/node/node.d.ts"/>

var fs = require('fs');
var glob = require('glob');
var marked = require('marked');

marked.setOptions({ gfm: true });

// This will get me all of the md files in a repo (including those in a node_modules. I could use this
// to create a script thatloads all of these files, and then checks them for broken links.
//https://github.com/isaacs/node-glob

// The glob may need to support all files.

// glob("*.md", { matchBase: true }, function (err, files) {
//     console.log(files);
// });

// var filesArray = glob.sync("(*.md|*.gif|*.png)", { matchBase: true });
var filesArray = glob.sync("*.md", { matchBase: true });
console.log(filesArray);


var fileContents;

fs.readFile('./README.md', function (err, data) {
    fileContents = new Buffer(data).toString();

// This gives us access to the results of a parser.
// https://github.com/chjj/marked

    // var tokens = marked.lexer(fileContents);
    // console.log(marked.parser(tokens));

    // var lexer = new marked.Lexer();
    // var tokens = lexer.lex(fileContents);
    // console.log(tokens);
    // console.log(lexer.rules);
});


// THIS READS EACH LINE IN A FILE. GETS US LINE NUMBER FOR REPORTING ERRORS.
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./README.md')
});

var lineCount = 1;


lineReader.on('line', function (line) {

    // var arrayOfLinks = line.match( /\[([^\]]+)\]\(([^)"]+)(?: \"([^\"]+)\")?\)/g );
    var arrayOfLinks = line.match( /(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?([ \t]*)((['"])(.*?)\6[ \t]*)?\))/g );
// from http://stackoverflow.com/questions/11404013/regular-expressions-with-javascript-replace-a-particular-submatch-group-with-so


    // Check whether there are any matches for a link on the line.
    if (arrayOfLinks) {


        for (var i = 0; i < arrayOfLinks.length; i++) {

            // Here we call a function that checks that each link is valid.
            // We check relative links for existence in our file list.
            // If the link starts with http or https, follow link and see if we get 200 or not.
            // What to do if the linked file is not an .md
            console.log(lineCount, arrayOfLinks[i]);
        }

        // console.log(lineCount, line);
        // console.log(lineCount, arrayOfLinks);
    }

    // console.log(lineCount, line);
    lineCount++;
});

// NOW WE NEED TO CHECK EACH LINK IN EACH LINE.
// There can be multiple links in each line.