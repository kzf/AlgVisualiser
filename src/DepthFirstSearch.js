'use strict';

var graphView = require('./graphView'),
		RandomDigraph = require('./RandomDigraph');

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
			desc: function() {
				return "Mark all nodes as unvisited";
			},
			level: 0
		},
		getNextNode: {
			desc: function() {
				if (this.returnval === -1) {
					return "";
				} else {
					return "Got the next node: " + this.returnval;
				}
			},
			level: 1
		},
		findUnvisitedNode: {
			desc: function() {
				if (this.returnval === -1) {
					return "No more unvisited nodes, so we are done";
				} else {
					return "No nodes left on the stack so taking next unvisited node, " +
								this.returnval;
				}
			},
			level: 1
		},
		visitNode: {
			desc: function() {
				return "Marking node " + this.arguments[0].name + " as visited and adding neighbours to the stack";
			},
			level: 0
		},
		checkLink: {
			desc: function() {
				return "Checking link " + params.links[this.arguments[0]].source.name +
						"->" + params.links[this.arguments[0]].target.name;
			},
			level: 2
		},
		popFromStack: {
			desc: function() {
				return "Popping a node off the stack";
			},
			level: 1
		},
		addToStack: {
			desc: function() {
				return "Adding node " + params.nodes[this.arguments[0]].name + " to the stack";
			},
			level: 1
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
		next = this.popFromStack();
		if (!this.visited[next]) {
			return next;
		}
	}
	return this.findUnvisitedNode();
};

DepthFirstSearch.prototype.popFromStack = function() {
	return this.stack.pop();
};

DepthFirstSearch.prototype.findUnvisitedNode = function() {
	while (this.visited[++this.current]) {
	}
	if (this.current === this.nodes.length) {
		return -1;
	}
	return this.current;
};

DepthFirstSearch.prototype.visitNode = function(i) {
	this.visited[i] = true;
	var self = this;
	this.nodes[i].links.forEach(function (l) {
		self.checkLink(l.id);
		self.keyframe();
	});
};

DepthFirstSearch.prototype.checkLink = function(id) {
	var l = this.links[id];
	if (!this.visited[l.target.name]) {
		this.addToStack(l.target.name);
	}
};

DepthFirstSearch.prototype.addToStack = function(i) {
	this.stack.push(i);
};

DepthFirstSearch.prototype.keyframe = function() {
	this.numKeyframes++;
};


/*================
	Graph View
	================*/
var StackView = function(container) {
	this.container = container;
	this.init();
	this.stackAdd = [];
	this.stackPop = [];
};

StackView.prototype.addStep = function(i, step) {
	if (step.name === 'addToStack') {
		this.stackAdd[i] = step.arguments[0];
	} else if (step.name === 'popFromStack') {
		this.stackPop[i] = true;
	}
};

StackView.prototype.doStep = function(i) {
	if (typeof this.stackAdd[i] !== 'undefined') {
		this.stack.append($("<span>").addClass("stack-element").text(this.stackAdd[i]));
	}
	if (typeof this.stackPop[i] !== 'undefined') {
		var node = this.stack.children().last();
		this.stackPop[i] = node.text();
		node.remove();
	}
};

StackView.prototype.undoStep = function(i) {
	if (typeof this.stackAdd[i] !== 'undefined') {
		this.stack.children().last().remove();
	}
	if (typeof this.stackPop[i] !== 'undefined') {
		this.stack.append($("<span>").addClass("stack-element").text(this.stackPop[i]));
	}
};

StackView.prototype.init = function() {
	this.stack = $("<div>").addClass("bottom-right-container").addClass("stack");
	$(this.container).append(this.stack);
};



var DFSGraphView = graphView({
	config: {
		'visitingNode': true,
		'visitingLink': true
	},
	adjacencyList: true,
	customAddon: StackView,
	getNextNode: {
		nodeClass: ['visitingNode', 'visitedNode'],
		clearLinkClass: 'visitingLink'
	},
	checkLink: {
		linkClass: ['visitingLink', 'visitedLink']
	}
});

/*=========
	Exports
	=========*/
exports.Alg = DepthFirstSearch;
exports.Examples = RandomDigraph;
exports.GraphView = DFSGraphView;