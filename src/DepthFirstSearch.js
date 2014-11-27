'use strict';

var graphView = require('./graphView');

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
		},
		checkLink: {
			desc: "Checking link",
			level: 2
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
		self.checkLink(l.id);
	});
};

DepthFirstSearch.prototype.checkLink = function(id) {
	var l = this.links[id];
	if (!this.visited[l.target.name]) {
		this.stack.push(l.target.name);
	}
	this.keyframe();
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
		link = {id: i, source: nodes[s], target: nodes[t]};
		links.push(link);
		nodes[s].links.push(link);
	}

	return {nodes: nodes, links: links};
};

/*================
	Graph View
	================*/
var DFSGraphView = graphView({
	config: {
		'tortoise': true,
		'visited': false,
		'visitingLink': true,
		'visitedLink': false
	},
	visitNode: {
		nodeClass: ['tortoise', 'visited'],
	},
	checkLink: {
		linkClass: ['visitingLink', 'visitedLink']
	}
});

/*=========
	Exports
	=========*/
exports.Alg = DepthFirstSearch;
exports.Examples = Examples;
exports.GraphView = DFSGraphView;