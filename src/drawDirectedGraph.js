'use strict';

/*====================
	drawDirectedGraph
	Draws a directed graph with D3 in the given container element.
	Returns an object with the following properties:
		return.allNodes: a D3 object selection containing all the nodes
		return.nodes: an array cotaining the (ordered) list of input nodes as DOM objects
		return.allLinks: a D3 object selection containing all the links
		return.links: an array containing the (ordered) list of input links as DOM objects
	====================*/
function drawDirectedGraph(container, nodes, links, widthF) {

	var ret = { nodes: [], links: [] };

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
	    .size([1000,1000])
	    .linkDistance(400)
	    .charge(-500)
	    .on("tick", tick)
	    .start();

	var svg = d3.select(container).append("svg");

	/* Dynamically adjust the size to fit the container */
	var resize = function() {
	    var width = container.clientWidth;
	    var height = container.clientHeight;
	    svg.attr("width", width).attr("height", height);
	    force.size([width, height])
	    		 .linkDistance(widthF ? widthF(width) : 100)
	    		 .start();
	};
	window.addEventListener('resize', resize); 
	setTimeout(resize, 300);
	

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

	var freeze = $("<button></button>")
						.text("freeze")
						.addClass("view-floating-button")
						.addClass("ui-button-slide")
						.click(function() {
							force.stop();
						});
	$(container).append(freeze);

	/* Set up return values */
	node[0].forEach(function(n) {
		ret.nodes.push(d3.select(n));
	});
	ret.allNodes = node;
	path[0].forEach(function(l) {
		ret.links.push(d3.select(l));
	});
	ret.allLinks = path;

	return ret;
}

module.exports = drawDirectedGraph;