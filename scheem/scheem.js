var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('my.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
console.log(parse("(a b c)"));
// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );