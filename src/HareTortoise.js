'use strict';

var LinkedList = require('./LinkedList'),
		drawDirectedGraph = require('./drawDirectedGraph'),
		KeyframeHandler = require("./KeyframeHandler");

/*==================
	Hare and Tortoise Algorithm for finding cycles in
	a linkedlist 
	==================*/
var HareTortoise = function(params) {
	this.head = params.linkedlist;

	this.straightLength = -1; // distance to first cycle
	this.cycleLength = -1; // length of cycle

	this.numKeyframes = 0;

	this.stepDescriptions = {
		initialisePointers: {
			desc: "Initalise both pointers to the start of the list",
			level: 0
		},
		comparePointers: {
			desc: "Check whether the pointers are equal",
			level: 0
		},
		hareStep: {
			desc: "Move the hare pointer two steps forward",
			level: 1
		},
		tortoiseStep: {
			desc: "Move the tortoise pointer just one step forward",
			level: 1
		},
		initCycleCount: {
			desc: "Start counting the length of the cycle and move the tortoise one step forward",
			level: 1
		},
		cycleLengthIncrement: {
			desc: "Add one to the length of the cycle",
			level: 1
		},
		initCycleFind: {
			desc: "Move the tortoise the length of the cycle ahead",
			level: 0
		},
		bothOneStep: {
			desc: "Move both pointers one step forward",
			level: 1
		}
	};
};

HareTortoise.prototype.generate = function() {
	this.keyframe();
	this.initialisePointers();
	this.keyframe();
	while (this.comparePointers()) {
		this.tortoiseStep();
		this.hareStep();
		this.keyframe();
	}
	this.keyframe();
	this.initCycleCount();
	this.keyframe();
	while (this.comparePointers()) {
		this.tortoiseStep();
		this.cycleLengthIncrement();
		this.keyframe();
	}
	this.keyframe();
	this.initCycleFind();
	this.keyframe();
	while (this.comparePointers()) {
		this.bothOneStep();
		this.keyframe();
	}
	this.keyframe();
};

HareTortoise.prototype.initialisePointers = function() {
	this.hare = this.head;
	this.tortoise = this.head;
};

HareTortoise.prototype.comparePointers = function() {
	return this.tortoise === this.head || this.hare !== this.tortoise;
};

HareTortoise.prototype.hareStep = function() {
	this.hare = this.hare.next.next;
};

HareTortoise.prototype.tortoiseStep = function() {
	this.tortoise = this.tortoise.next;
};

HareTortoise.prototype.initCycleCount = function() {
	this.tortoise = this.tortoise.next;
	this.cycleLength = 1;
};

HareTortoise.prototype.cycleLengthIncrement = function() {
	this.cycleLength++;
};

HareTortoise.prototype.initCycleFind = function() {
	this.tortoise = this.head;
	this.hare = this.head;
	this.straightLength = 1;
	for (var i = 0; i < this.cycleLength; i++) {
		this.tortoise = this.tortoise.next;
	}
};

HareTortoise.prototype.bothOneStep = function() {
	this.tortoise = this.tortoise.next;
	this.hare = this.hare.next;
	this.straightLength++;
};

HareTortoise.prototype.keyframe = function() {
	this.numKeyframes++;
};


/*=======================
	Factory for generating example inputs
	=======================*/
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


/*=====================
	Graph View of the Hare Tortoise Algorithm
	=====================*/
var GraphView = function(container, steppedAlgorithm) {
	this.container = $(container);
	this.steppedAlgorithm = steppedAlgorithm;
	this.keyframes = new KeyframeHandler(this.steppedAlgorithm.steps);
	this.nodes = [];
	this.allNodes = [];
	this.pointers = [];

	this.showGraph();

	this.hare = -1;
	this.tortoise = -1;
};

GraphView.prototype.setPointers = function(h, t) {
	this.hare = h;
	this.tortoise = t;
	this.allNodes.classed("tortoise", false).classed("hare", false);
	this.hare.classed("hare", true);
	this.tortoise.classed("tortoise", true);
};

GraphView.prototype.addStep = function(i, step) {
	var hare = this.hare,
			tortoise = this.tortoise,
			self = this;
	var next = function(node) {
		return self.nodes[node.data()[0].next];
	};
	if (step.name === 'initialisePointers') {
		hare = this.nodes[0];
		tortoise = this.nodes[0];
	} else if (step.name === 'hareStep') {
		hare = next(next(hare));
	} else if (step.name === 'tortoiseStep' || step.name === 'initCycleCount') {
		tortoise = next(tortoise);
	} else if (step.name === 'initCycleFind') {
		hare = this.nodes[0];
		tortoise = this.nodes[this.steppedAlgorithm.alg.cycleLength];
	} else if (step.name === 'bothOneStep') {
		hare = next(hare);
		tortoise = next(tortoise);
	}
	this.pointers[i] = {hare: hare, tortoise: tortoise};
	return step;
};

GraphView.prototype.doStep = function(i) {
	this.setPointers(this.pointers[i].hare, this.pointers[i].tortoise);
};

GraphView.prototype.undoStep = function(i) {
	if (i === 1) {
		this.setPointers(d3.select(), d3.select());
	} else {
		this.setPointers(this.pointers[i-1].hare, this.pointers[i-1].tortoise);
	}
};

GraphView.prototype.next = function() {
	var frame = this.keyframes.next(), self = this;
	frame.steps.forEach(function(step) {
		if (frame.add) {
			self.addStep(step.id, step.step);
		}
		self.doStep(step.id);
	});
};

GraphView.prototype.last = function() {
	var frame = this.keyframes.last(), self = this;
	frame.steps.forEach(function(step) {
		self.undoStep(step.id);
	});
};

GraphView.prototype.showGraph = function() {
	
	var i,j, nodes = {}, links = [];

	/* Build a graph representation of the linked list */
	for (i = 0; i < this.steppedAlgorithm.alg.straightLength; i++) {
		nodes[i] = {name: i, next: i+1};
		if (i > 0) {
			links.push({source: nodes[i-1], target: nodes[i], value: 1});
		}
	}
	for (j = 0; j < this.steppedAlgorithm.alg.cycleLength-1; j++) {
		nodes[j+i] = {name: j+i, next: j+i+1};
		links.push({source: nodes[j+i-1], target: nodes[j+i], value: 1});
	}
	links.push({source: nodes[j+i-1], target: nodes[i-1], value: 1});
	nodes[j+i-1].next = i-1;

	var nodesWide = this.steppedAlgorithm.alg.straightLength+this.steppedAlgorithm.alg.cycleLength/2;
	var graph = drawDirectedGraph(this.container[0], nodes, links, function(w) {
		return w/nodesWide;
	});

	this.allNodes = graph.allNodes;
	this.nodes = graph.nodes;

};

/*=========
	Exports
	=========*/
exports.Alg = HareTortoise;
exports.Examples = ExampleFactory;
exports.GraphView = GraphView;