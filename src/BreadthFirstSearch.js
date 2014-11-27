'use strict';

var graphView = require('./graphView'),
		RandomDigraph = require('./RandomDigraph');

/*==============
	Depth First Search
	==============*/
var BreadthFirstSearch = function(params) {
	this.nodes = params.nodes;
	this.links = params.links;

	this.visited = [];
	this.current = -1;

	this.queue = [];

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
		popFromQueue: {
			desc: function() {
				return "Dequeueing a node from the queue";
			},
			level: 1
		},
		addToQueue: {
			desc: function() {
				return "Adding node " + params.nodes[this.arguments[0]].name + " to the queue";
			},
			level: 1
		}
	};
};

BreadthFirstSearch.prototype.generate = function() {
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

BreadthFirstSearch.prototype.initialise = function() {
	var i;
	for (i = 0; i < this.nodes.length; i++) {
		this.visited[i] = false;
	}
	this.current = -1;
};

BreadthFirstSearch.prototype.getNextNode = function() {
	if (this.queue.length === 0) {
		return this.findUnvisitedNode();
	}
	var next;
	while (this.queue.length > 0) {
		next = this.popFromQueue();
		if (!this.visited[next]) {
			return next;
		}
	}
	return this.findUnvisitedNode();
};

BreadthFirstSearch.prototype.popFromQueue = function() {
	return this.queue.shift();
};

BreadthFirstSearch.prototype.findUnvisitedNode = function() {
	while (this.visited[++this.current]) {
	}
	if (this.current === this.nodes.length) {
		return -1;
	}
	return this.current;
};

BreadthFirstSearch.prototype.visitNode = function(i) {
	this.visited[i] = true;
	var self = this;
	this.nodes[i].links.forEach(function (l) {
		self.checkLink(l.id);
		self.keyframe();
	});
};

BreadthFirstSearch.prototype.checkLink = function(id) {
	var l = this.links[id];
	if (!this.visited[l.target.name]) {
		this.addToQueue(l.target.name);
	}
};

BreadthFirstSearch.prototype.addToQueue = function(i) {
	this.queue.push(i);
};

BreadthFirstSearch.prototype.keyframe = function() {
	this.numKeyframes++;
};


/*================
	Graph View
	================*/
var QueueView = function(container) {
	this.container = container;
	this.init();
	this.queueAdd = [];
	this.queuePop = [];
};

QueueView.prototype.addStep = function(i, step) {
	if (step.name === 'addToQueue') {
		this.queueAdd[i] = step.arguments[0];
	} else if (step.name === 'popFromQueue') {
		this.queuePop[i] = true;
	}
};

QueueView.prototype.doStep = function(i) {
	if (typeof this.queueAdd[i] !== 'undefined') {
		this.queue.append($("<span>").addClass("stack-element").text(this.queueAdd[i]));
	}
	if (typeof this.queuePop[i] !== 'undefined') {
		var node = this.queue.children().first();
		this.queuePop[i] = node.text();
		node.remove();
	}
};

QueueView.prototype.undoStep = function(i) {
	if (typeof this.queueAdd[i] !== 'undefined') {
		this.queue.children().first().remove();
	}
	if (typeof this.queuePop[i] !== 'undefined') {
		this.queue.append($("<span>").addClass("stack-element").text(this.queuePop[i]));
	}
};

QueueView.prototype.init = function() {
	this.queue = $("<div>").addClass("bottom-right-container").addClass("queue");
	$(this.container).append(this.queue);
};



var BFSGraphView = graphView({
	config: {
		'visitingNode': true,
		'visitingLink': true
	},
	adjacencyList: true,
	customAddon: QueueView,
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
exports.Alg = BreadthFirstSearch;
exports.Examples = RandomDigraph;
exports.GraphView = BFSGraphView;