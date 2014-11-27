'use strict';

var Examples = function() {
	this.parameters = [
		{
			desc: "Number of nodes",
			initial: 8,
			type: Number
		},
		{
			desc: "Number of edges",
			initial: 12,
			type: Number
		}
	];
	this.initial = this.build(8, 12);
};

Examples.prototype.build = function(n, E) {
	var isConnectedTo = function(s, t) {
		for (var i = 0; i < nodes[s].links.length; i++) {
			if (nodes[s].links[i].target.name === t) {
				return true;
			}
		}
		return false;
	};

	var i, nodes = [];
	for (i = 0; i < n; i++) {
		nodes.push({name: i, links: []});
	}

	// Add 20 random edges
	var s, t, link, links = [];
	for (i = 0; i < E; i++) {
		s = t = Math.floor(Math.random()*n);
		while (nodes[s].links.length === n-1) {
			s = Math.floor(Math.random()*n);
		}
		while (t === s || isConnectedTo(s, t)) {
			t = Math.floor(Math.random()*n);
		}
		link = {id: i, source: nodes[s], target: nodes[t]};
		links.push(link);
		nodes[s].links.push(link);
	}

	var linkCompare = function(x, y) {
		return x.target.name - y.target.name;
	};
	for (i = 0; i < n; i++) {
		nodes[i].links.sort(linkCompare);
	}

	return {nodes: nodes, links: links};
};

module.exports = Examples;