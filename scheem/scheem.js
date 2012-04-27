var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// console.log(parse("(a b c)"));

// tests
// assert_eq(parse(""), undefined,    "don't parse empty string");
assert.deepEqual(parse("atom"), "atom");
assert.deepEqual(parse("+"), "+");
assert.deepEqual(parse("(+ x 3)"), ["+", "x", "3"]);
assert.deepEqual(parse("(+ 1 (f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]]);

// space tests
assert.deepEqual(parse("(a  b c)"), ["a", "b", "c"] );
assert.deepEqual(parse(" (a  b c)"), ["a", "b", "c"] );
assert.deepEqual(parse(" (a  b  c ) "), ["a", "b", "c"] );
assert.deepEqual(parse("\t (+ 1\n  ( f x \n \t 3 y)\n) "), ["+", "1", ["f", "x", "3", "y"]]);

// quote tests
assert.deepEqual(parse("(quote a)"), ["quote", "a"]);
assert.deepEqual(parse("'a"), ["quote", "a"]);
assert.deepEqual(parse("'(a)"), ["quote", ["a"]]);
assert.deepEqual(parse("'(a b (c d))"), ["quote", ["a", "b", ["c", "d"]]]);
assert.deepEqual(parse("(a b '(c d))"), ["a", "b", ["quote", ["c", "d"]]]);

// comment
assert.deepEqual(parse("(quote a) ;; foobar "), ["quote", "a"]);
