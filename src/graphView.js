'use strict';

var drawDirectedGraph = require('./drawDirectedGraph'),
		KeyframeHandler = require("./KeyframeHandler");

var graphView = function(params) {

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
				logNodeClass(i, step.returnval, params[step.name].nodeClass);
			}
			if (params[step.name].linkClass) {
				logLinkClass(i, step.arguments[0], params[step.name].linkClass);
			}
			if (params[step.name].clearLinkClass) {
				logLinkClass(i, -1, params[step.name].clearLinkClass);
			}
		}
	};

	_GraphView.prototype.doStep = function(i) {
		var c, k;
		for (c in this.nodeLists) {
			if (this.nodeLists.hasOwnProperty(c)) {
				if (typeof this.nodeLists[c][i] !== 'undefined') {
					if (params.config[c]) {
						this.allNodes.classed(c, false);
						if (params.adjacencyList) {
							for (k = 0; k < this.adjacencyListLabels.length; k++) {
								this.adjacencyListLabels[k].removeClass(c);
							}
						}
					}
					if (this.nodeLists[c][i] !== -1) {
						this.nodes[this.nodeLists[c][i]].classed(c, true);
						if (params.adjacencyList) {
							this.adjacencyListLabels[this.nodeLists[c][i]].addClass(c);
						}
					}
				}
			}
		}
		for (c in this.linkLists) {
			if (this.linkLists.hasOwnProperty(c)) {
				if (typeof this.linkLists[c][i] !== 'undefined') {
					if (params.config[c]) {
						this.allLinks.classed(c, false);
						if (params.adjacencyList) {
							for (k = 0; k < this.adjacencyList.length; k++) {
								this.adjacencyList[k].removeClass(c);
							}
						}
					}
					if (this.linkLists[c][i] !== -1) {
						this.links[this.linkLists[c][i]].classed(c, true);
						if (params.adjacencyList) {
							this.adjacencyList[this.linkLists[c][i]].addClass(c);
						}
					}
				}
			}
		}
	};

	_GraphView.prototype.undoStep = function(i) {
		var j, c;
		for (c in this.nodeLists) {
			if (this.nodeLists.hasOwnProperty(c)) {
				if (typeof this.nodeLists[c][i] !== 'undefined') {
					if (params.config[c]) {
						// Find last time this class was active
						j = i;
						while (--j >= 0 && typeof this.nodeLists[c][j] === 'undefined') {
						}
						if (j >= 0 && this.nodeLists[c][j] !== -1) {
							this.nodes[this.nodeLists[c][j]].classed(c, true);
							if (params.adjacencyList) {
								this.adjacencyListLabels[this.nodeLists[c][j]].addClass(c);
							}
						}
					}
					if (this.nodeLists[c][i] !== -1) {
						this.nodes[this.nodeLists[c][i]].classed(c, false);
						if (params.adjacencyList) {
							this.adjacencyListLabels[this.nodeLists[c][i]].removeClass(c);
						}
					}
				}
			}
		}
		for (c in this.linkLists) {
			if (this.linkLists.hasOwnProperty(c)) {
				if (typeof this.linkLists[c][i] !== 'undefined') {
					if (params.config[c]) {
						// Find last time this class was active
						j = i;
						while (--j >= 0 && typeof this.linkLists[c][j] === 'undefined') {
						}
						if (j >= 0 && this.linkLists[c][j] !== -1) {
							this.links[this.linkLists[c][j]].classed(c, true);
							if (params.adjacencyList) {
								this.adjacencyList[this.linkLists[c][j]].addClass(c);
							}
						}
					}
					if (this.linkLists[c][i] !== -1) {
						this.links[this.linkLists[c][i]].classed(c, false);
						if (params.adjacencyList) {
							this.adjacencyList[this.linkLists[c][i]].removeClass(c);
						}
					}
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

		if (params.adjacencyList) {
			this.adjacencyList = [];
			this.adjacencyListLabels = [];
			var nodes = this.steppedAlgorithm.alg.nodes;
			var adj = $("<table></table>").addClass("adjacency-list");
			var i, j, row, el, label;
			for (i = 0; i < nodes.length; i++) {
				label = $("<td>").text(nodes[i].name).addClass("row-label");
				this.adjacencyListLabels[i] = label;
				row = $("<tr>").append(label);
				adj.append(row);
				console.log(nodes[i]);
				for (j = 0; j < nodes[i].links.length; j++) {
					el = $("<td>").text(nodes[i].links[j].target.name);
					this.adjacencyList[nodes[i].links[j].id] = el;
					row.append(el);
				}
			}
			var alContainer = $("<div>").addClass("top-right-container");
			alContainer.append(adj);
			$(this.container).append(alContainer);
		}
	};

	return _GraphView;

};

module.exports = graphView;