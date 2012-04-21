var endTime = function (time, expr) {
    var leftTime, rightTime;
    if (expr.tag == 'note') {
        return time + expr.dur;
    } else if (expr.tag == 'rest') {
        return time + expr.duration;
    } else if (expr.tag == 'repeat') {
	return time + (expr.section.count * getDuration(expr.section));
    } else if (expr.tag == 'seq') {
        leftTime = endTime(time, expr.left);
        return  endTime(leftTime, expr.right);
    } else { // par
        leftTime = endTime(time, expr.left);
        rightTime = endTime(time, expr.right);
        return Math.max(leftTime, rightTime);
    }
};

var getDuration = function(expr) {
    var leftTime, rightTime;
    if (expr.tag == 'note') {
        return expr.dur;
    } else if (expr.tag == 'rest') {
        return expr.duration;
    } else if (expr.tag == 'repeat') {
	return (expr.section.count * getDuration(expr.section));
    } else if (expr.tag == 'seq') {
        return  (getDuration(expr.left) + getDuration(expr.right));
    } else { // par
        leftTime = getDuration(expr.left);
        rightTime = getDuration(expr.right);
        return Math.max(leftTime, rightTime);
    }
}

//  21    A0
// 108    C8
var convertPitch = function(noteName, midiNum) {
    var noteLetter = noteName[0];
    var octave     = noteName[1];
    var offsets    = {c : 0,
                      d : 2,
                      e : 4,
                      f : 5,
                      g : 7,
                      a : 9,
                      b : 11};

    return 12 + (12 * octave) + offsets[noteLetter];
    
};

var compileT = function(time, expr) {
    var _left, _right;
    var repeats = [];
    var repeatVal;
    var repeatDur = 0;
    if (expr.tag == 'note') {
        return [{tag: 'note', 
     	         pitch: convertPitch(expr.pitch),
                 start: time,
                 dur: expr.dur}];
    } else if (expr.tag == 'rest') {
	return [];
    } else if (expr.tag == 'seq') {
        _left = compileT(time, expr.left);
        _right = compileT(endTime(time, expr.left), expr.right);
        return _left.concat(_right);
    } else if (expr.tag == 'repeat') {
	repeatDur = getDuration(expr.section);
	for (var i=0; i < expr.count; i++){
	    repeatVal = compileT(time+i*repeatDur, expr.section);
	    repeats = repeats.concat(compileT(time+i*repeatDur, expr.section));
	}
	return repeats;
    } else {  // 'par'
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


var melody_mus_repeat = 
   { tag: 'repeat',
     section: { tag: 'note', pitch: 'c4', dur: 250 },
     count: 3 };
console.log(melody_mus_repeat);
console.log(compile(melody_mus_repeat));
