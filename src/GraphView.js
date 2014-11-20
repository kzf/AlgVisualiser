'use strict';

var KeyframeHandler = require("./KeyframeHandler");

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
	console.log(this.pointers);
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

	var container = this.container[0];

	/* Function to draw the arcs and update the node positions */
	function tick() {
		path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
    });

    node.attr("transform", function(d) { 
		    return "translate(" + d.x + "," + d.y + ")";
		});
	}

	/* Graph layout */
	var force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
	    .size([600,600])
	    .linkDistance(400)
	    .charge(-500)
	    .on("tick", tick)
	    .start();

	var svg = d3.select(container).append("svg");

	/* Dynamically adjust the size to fit the container */
	var self=  this;
	var resize = function() {
	    var width = container.clientWidth;
	    var height = container.clientHeight;
	    svg.attr("width", width).attr("height", height);
	    console.log(width/(self.steppedAlgorithm.alg.cycleLength/2 +self.steppedAlgorithm.alg.straightLength));
	    force.size([width, height])
	    		 .linkDistance(width/(self.steppedAlgorithm.alg.cycleLength/2 +self.steppedAlgorithm.alg.straightLength))
	    		 .start();
	};
	window.addEventListener('resize', resize); 
	resize();
	

	/* Define the arrow */
	svg.append("svg:defs").selectAll("marker")
	    .data(["end"])      // Different link/path types can be defined here
	  .enter().append("svg:marker")    // This section adds in the arrows
	    .attr("id", String)
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 20)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5");

	/* Inser the svg for the paths */
	var path = svg.append("svg:g").selectAll("path")
	    .data(force.links())
	  .enter().append("svg:path")
	    .attr("class", function(d) { return "link " + d.type; })
	    .attr("marker-end", "url(#end)");

	/* Insert the svg for the nodes */
	var node = svg.selectAll(".node")
	    .data(force.nodes())
	  .enter().append("g")
	    .attr("class", "node")
	    .call(force.drag);

	/* Draw the nodes in each <g> */
	node.append("circle")
	    .attr("r", 10);

	node[0].forEach(function(n) {
		self.nodes.push(d3.select(n));
	});

	this.allNodes = node;

	var freeze = $("<button></button>")
						.text("freeze")
						.addClass("view-floating-button")
						.click(function() {
							force.stop();
						});
	this.container.append(freeze);

};

module.exports = GraphView;