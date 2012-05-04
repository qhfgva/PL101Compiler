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

var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) -
                   evalScheem(expr[2], env);
        case '*':
            return evalScheem(expr[1], env) *
                   evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1], env) /
                   evalScheem(expr[2], env);
        case 'quote':
            return expr[1];
        case 'define':
	    env[expr[1]] = evalScheem(expr[2],env);
            return 0;
        case 'set!':
            env[expr[1]] = evalScheem(expr[2],env);
            return 0;
        case 'begin':
            var result = 0;
            for (var i=1; i<expr.length; i++) {
                result = evalScheem(expr[i], env);
            }
            return result;
        case '<':
            var lt =
                (evalScheem(expr[1], env) <
                 evalScheem(expr[2], env));
            if (lt) return '#t';
            return '#f';
        case 'cons':
	    return [evalScheem(expr[1],env)].concat(evalScheem(expr[2],env));
        case 'car':
            return evalScheem(expr[1],env)[0];
        case 'cdr':
            var x = evalScheem(expr[1],env); 
            return x.slice(1,x.length);
        case '=':
            var eq =
                (evalScheem(expr[1], env) ===
                 evalScheem(expr[2], env));
            if (eq) return '#t';
            return '#f';
        case 'if':
            var test = evalScheem(expr[1], env);
            var result = '';
            if (test == '#f') {
                result = evalScheem(expr[3], env);
            } 
            else {
                result = evalScheem(expr[2], env);
            }
            return result;

    }
};

var evalScheemString = function(scheemStr, env) {
    return evalScheem(parse(scheemStr), env);
};


// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
    module.exports.evalScheemString = evalScheemString;
}