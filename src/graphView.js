'use strict';

var drawDirectedGraph = require('./drawDirectedGraph'),
		KeyframeHandler = require("./KeyframeHandler");

var graphView = function(params) {

	console.log(params);

	var _GraphView = function(container, steppedAlgorithm) {
		this.container = container;
		this.steppedAlgorithm = steppedAlgorithm;
		this.keyframes = new KeyframeHandler(this.steppedAlgorithm.steps);

		this.nodeLists = {};
		this.linkLists = {};

		this.showGraph();
	};

	_GraphView.prototype.addStep = function(i, step) {
		var self = this;
		var logNodeClass = function(i, id, c) {
			if (typeof c === 'string') {
				c = [c];
			}
			c.forEach(function(x) {
				if (!self.nodeLists[x]) {
					self.nodeLists[x] = [];
				}
				self.nodeLists[x][i] = id;
			});
		};
		var logLinkClass = function(i, id, c) {
			if (typeof c === 'string') {
				c = [c];
			}
			c.forEach(function(x) {
				if (!self.linkLists[x]) {
					self.linkLists[x] = [];
				}
				self.linkLists[x][i] = id;
			});
		};
		if (params[step.name]) {
			if (params[step.name].nodeClass) {
				logNodeClass(i, step.arguments[0], params[step.name].nodeClass);
			}
			if (params[step.name].linkClass) {
				console.log(params[step.name].linkClass);
				logLinkClass(i, step.arguments[0], params[step.name].linkClass);
			}
		}
	};

	_GraphView.prototype.doStep = function(i) {
		var c;
		for (c in this.nodeLists) {
			if (this.nodeLists.hasOwnProperty(c)) {
				if (typeof this.nodeLists[c][i] !== 'undefined') {
					if (params.config[c]) {
						this.allNodes.classed(c, false);
					}
					this.nodes[this.nodeLists[c][i]].classed(c, true);
				}
			}
		}
		for (c in this.linkLists) {
			if (this.linkLists.hasOwnProperty(c)) {
				if (typeof this.linkLists[c][i] !== 'undefined') {
					if (params.config[c]) {
						this.allLinks.classed(c, false);
					}
					this.links[this.linkLists[c][i]].classed(c, true);
				}
			}
		}
	};

	_GraphView.prototype.undoStep = function(i) {
		var j;
		for (var c in this.nodeLists) {
			if (this.nodeLists.hasOwnProperty(c)) {
				if (typeof this.nodeLists[c][i] !== 'undefined') {
					if (params.config[c]) {
						// Find last time this class was active
						j = i;
						while (--j >= 0 && typeof this.nodeLists[c][j] === 'undefined') {
						}
						if (j >= 0) {
							this.nodes[this.nodeLists[c][j]].classed(c, true);
						}
					}
					this.nodes[this.nodeLists[c][i]].classed(c, false);
				}
			}
		}
	};

	_GraphView.prototype.next = function() {
		var frame = this.keyframes.next(), self = this;
		frame.steps.forEach(function(step) {
			if (frame.add) {
				self.addStep(step.id, step.step);
			}
			self.doStep(step.id);
		});
	};

	_GraphView.prototype.last = function() {
		var frame = this.keyframes.last(), self = this;
		frame.steps.forEach(function(step) {
			self.undoStep(step.id);
		});
	};

	_GraphView.prototype.showGraph = function() {
		var graph = drawDirectedGraph(
			this.container, 
			this.steppedAlgorithm.alg.nodes, 
			this.steppedAlgorithm.alg.links
		);

		this.allNodes = graph.allNodes;
		this.nodes = graph.nodes;
		this.links = graph.links;
		this.allLinks = graph.allLinks;
	};

	return _GraphView;

};

module.exports = graphView;