if (typeof module !== 'undefined') {
    // In Node load required modules
    var assert = require('chai').assert;
    var evalScheem = require('../scheem').evalScheem;
    var evalScheemString = require('../scheem').evalScheemString;
} else {
    // In browser assume already loaded by <script> tags
    var assert = chai.assert;
}

suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]], {}),
            [1, 2, 3]
        );
    });
});

suite('numbers', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(3, {}),
            3
        );
    });
});

suite('variable references', function() {
    test('a number', function() {
        assert.deepEqual(
  	    evalScheem('x', {x: 5}),
            5
        );
    });
    test('a math expression', function() {
        assert.deepEqual(
	    evalScheem(['/', 'z', ['+', 'x', 'y']], {x: 2, y: 3, z: 10}),
            2
        );
    });
});

// suite('assignment', function() {
//     test('define', function() {
//         assert.deepEqual(
//   	    evalScheem(['define' 'x' 5], {}),
//             5
//         );
//     });
//     test('set!', function() {
//         assert.deepEqual(
// 	    evalScheem(['/', 'z', ['+', 'x', 'y']], {x: 2, y: 3, z: 10}),
//             2
//         );
//     });
// });

suite('begin', function() {
    test('a number', function() {
        assert.deepEqual(
  	    evalScheem(['begin', ['set!', 'x', 5], 
			         ['set!', 'x', ['+', 'y', 'x']], 
			         'x'], {x:1, y:2}), 
           7
        );
    });
});

suite('quoting', function() {
    test('simple quote', function() {
        assert.deepEqual(
  	    evalScheem(['quote', ['+', 2, 3]], {}),
            ['+', 2, 3]
        );
    });
    test('nested quote', function() {
        assert.deepEqual(
  	    evalScheem(['quote', ['quote', ['+', 2, 3]]], {}),
            ['quote', ['+', 2, 3]]
        );
    });
});

suite('numeric comparisons', function() {
    test('less than - true', function() {
        assert.deepEqual(
  	    evalScheem(['<', ['+', 1, 1], ['+', 2, 3]], {}),
            '#t'
        );
    });
    test('less than - false', function() {
        assert.deepEqual(
  	    evalScheem(['<', 2, 2], {}), 
            '#f'
        );
    });
});

suite('list manipulation', function() {
    test('cons', function() {
        assert.deepEqual(
 	   evalScheem(['cons', 1, ['quote', [3]]], {}), 
           [1,3]//,3,5]
        );
    });
    test('car', function() {
        assert.deepEqual(
  	   evalScheem(['car', ['quote',[1,2,3]]], {}), 
           1
        );
    });
    test('cdr', function() {
        assert.deepEqual(
	   evalScheem(['cdr', ['quote', [1,2,3]]], {}), 
           [2,3]//,3,5]
        );
    });
});

suite('conditionals', function() {
    test('if', function() {
        assert.deepEqual(
  	    evalScheem(['if', ['=', 'x', 5], 
			1, 2], {x:5}), 
           1
        );
    });
});

suite('end to end', function() {
    test('simple parse and eval', function() {
        assert.deepEqual(
           evalScheemString("(+ 3 4)", {}), 
           7
        );
    });
});
