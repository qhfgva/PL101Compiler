var endTime = function (time, expr) {
    var leftTime, rightTime;
    if (expr.tag == 'note') {
        return time + expr.dur;
    } else if (expr.tag == 'rest') {
        return time + expr.duration;
    } else if (expr.tag == 'seq') {
        leftTime = endTime(time, expr.left);
        return  endTime(leftTime, expr.right);
    } else {
        leftTime = endTime(time, expr.left);
        rightTime = endTime(time, expr.right);
        return Math.max(leftTime, rightTime);
    }
};

var compileT = function(time, expr) {
    var _left, _right;
    if (expr.tag == 'note') {
        return [{tag: 'note', 
                 pitch: expr.pitch,
                 start: time,
                 dur: expr.dur}];
    } else if (expr.tag == 'rest') {
	return [];
    } else if (expr.tag == 'seq') {
        _left = compileT(time, expr.left);
        _right = compileT(endTime(time, expr.left), expr.right);
        return _left.concat(_right);
    } else {
        //var Math.max(); 
        _left = compileT(time, expr.left);
        _right = compileT(time, expr.right);
        return _left.concat(_right);        
    }
};

var compile = function(expr) {
    return compileT(0, expr);
}; 


var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));

var melody_mus_rest = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'rest', duration: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus_rest);
console.log(compile(melody_mus_rest));
