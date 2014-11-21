'use strict';
var drawDirectedGraph = require('./drawDirectedGraph'),
		KeyframeHandler = require("./KeyframeHandler");
console.log(KeyframeHandler);
/*==============
	Depth First Search
	==============*/
var DepthFirstSearch = function(params) {
	this.nodes = params.nodes;
	this.links = params.links;

	this.visited = [];
	this.current = -1;

	this.stack = [];

	this.numKeyframes = 0;
	this.stepDescriptions = {
		initialise: {
			desc: "Mark all nodes as unvisited",
			level: 0
		},
		getNextNode: {
			desc: "Looking for next node on the stack",
			level: 1
		},
		findUnvisitedNode: {
			desc: "No nodes on the stack so looking for an unvisited node",
			level: 1
		},
		visitNode: {
			desc: "Marking node as visited and adding neighbours to the stack",
			level: 0
		}
	};
};

DepthFirstSearch.prototype.generate = function() {
	var node;
	this.keyframe();
	this.initialise();
	this.keyframe();
	while ( (node = this.getNextNode()) !== -1) {
		this.keyframe();
		console.log("visiting node " + node);
		this.visitNode(node);
		this.keyframe();
	}
	this.keyframe();
};

DepthFirstSearch.prototype.initialise = function() {
	var i;
	for (i = 0; i < this.nodes.length; i++) {
		this.visited[i] = false;
	}
	this.current = -1;
};

DepthFirstSearch.prototype.getNextNode = function() {
	if (this.stack.length === 0) {
		return this.findUnvisitedNode();
	}
	var next;
	while (this.stack.length > 0) {
		next = this.stack.pop();
		if (!this.visited[next]) {
			return next;
		}
	}
	return this.findUnvisitedNode();
};

DepthFirstSearch.prototype.findUnvisitedNode = function() {
	while (this.visited[++this.current]) {
		if (this.current === this.nodes.length - 1) {
			return -1;
		}
	}
	return this.current;
};

DepthFirstSearch.prototype.visitNode = function(i) {
	this.visited[i] = true;
	var self = this;
	this.nodes[i].links.forEach(function (l) {
		if (!self.visited[l.target.name]) {
			self.stack.push(l.target.name);
		}
	});
};

DepthFirstSearch.prototype.keyframe = function() {
	this.numKeyframes++;
};

/*===============
	Factory 
	===============*/
var Examples = function() {
	this.parameters = [
		{
			desc: "Number of nodes",
			initial: 8,
			type: Number
		}
	];
	this.initial = this.build(8);
};

Examples.prototype.build = function(n) {
	var i, nodes = [];
	for (i = 0; i < n; i++) {
		nodes.push({name: i, links: []});
	}

	// Add 20 random edges
	var s, t, link, links = [];
	for (i = 0; i < 20; i++) {
		s = t = Math.floor(Math.random()*n);
		while (t === s) {
			t = Math.floor(Math.random()*n);
		}
		link = {source: nodes[s], target: nodes[t]};
		links.push(link);
		nodes[s].links.push(link);
	}
	console.log(links, nodes);

	return {nodes: nodes, links: links};
};

/*================
	Graph View
	================*/
var GraphView = function(container, steppedAlgorithm) {
	this.container = container;
	this.steppedAlgorithm = steppedAlgorithm;
	this.keyframes = new KeyframeHandler(this.steppedAlgorithm.steps);

	this.currentNodes = [];
	this.visitedNodes = [];
	this.currentNode = null;

	this.showGraph();
};

GraphView.prototype.addStep = function(i, step) {
	if (step.name === 'visitNode') {
		this.currentNodes[i] = step.arguments[0];
		this.currentNode = step.arguments[0];
		this.visitedNodes[i+2] = this.currentNode;
	}
};

GraphView.prototype.doStep = function(i) {
	if (typeof this.currentNodes[i] !== 'undefined') {
		this.allNodes.classed("tortoise", false);
		this.nodes[this.currentNodes[i]].classed("tortoise", true);
	}
	if (typeof this.visitedNodes[i] !== 'undefined') {
		this.nodes[this.visitedNodes[i]].classed("visited", true);
	}
};

GraphView.prototype.undoStep = function(i) {
	this.allNodes.classed("tortoise", false);
	if (this.currentNodes[i-1]) {
		this.nodes[this.currentNodes[i-1]].classed("tortoise", true);
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
	var graph = drawDirectedGraph(
		this.container, 
		this.steppedAlgorithm.alg.nodes, 
		this.steppedAlgorithm.alg.links
	);

	this.allNodes = graph.allNodes;
	this.nodes = graph.nodes;
};

/*=========
	Exports
	=========*/
exports.Alg = DepthFirstSearch;
exports.Examples = Examples;
exports.GraphView = GraphView;