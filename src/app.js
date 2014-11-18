var LinkedList = require('./LinkedList'),
		Steppify = require('./Steppify'),
		TextView = require('./TextView'),
		HareTortoise = require('./HareTortoise');

var linkedlistWithCycle = function(a, b) {
	var i, node = new LinkedList(0);
	var first = node;
	for (i = 1; i < a; i++) {
		node = node.append(i);
	}
	var cycleStart = node;
	for (i = 1; i < b; i++) {
		node = node.append(a+i-1);
	}
	node.next = cycleStart;
	return first;
};

/*********************/

var cycle = linkedlistWithCycle(3, 5);
/*var alg = new HareTortoise({linkedlist: cycle});

var textView = new TextView(document.getElementById("view2"), alg);
textView.show();*/

var a = new Steppify(HareTortoise, {linkedlist: cycle});
console.log(a.steps);

var textView = new TextView(document.getElementById("view2"), a);
textView.show();