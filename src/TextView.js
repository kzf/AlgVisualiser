'use strict';

var TextView = function(container, steppedAlgorithm) {
	this.container = container;
	this.steppedAlgorithm = steppedAlgorithm;
};

TextView.prototype.show = function() {
	var container = this.container;
	this.steppedAlgorithm.steps.forEach(function(s) {
		var step = document.createElement("p");
		step.className = "step ";
		step.innerHTML = s.name;
		container.appendChild(step);
	});
};

module.exports = TextView;