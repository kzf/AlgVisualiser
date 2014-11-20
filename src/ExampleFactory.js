'use strict';

var LinkedList = require('./LinkedList');

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

var ExampleFactory = function() {
	this.parameters = [
		{
			desc: "Straight part length",
			initial: 7,
			type: Number
		},
		{
			desc: "Cycle length",
			initial: 5,
			type: Number
		}
	];
	this.initial = this.build(7, 5);
};

ExampleFactory.prototype.build = function(straightLength, cycleLength) {
	return {linkedlist: linkedlistWithCycle(straightLength, cycleLength)};
};

module.exports = ExampleFactory;