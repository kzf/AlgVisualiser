'use strict';

var KeyframeHandler = require("./KeyframeHandler");

var TextView = function(container, steppedAlgorithm) {
	this.container = $(container);
	this.steppedAlgorithm = steppedAlgorithm;
	this.keyframes = new KeyframeHandler(this.steppedAlgorithm.steps);
	this.stepElements = [];
};

TextView.prototype.addStep = function(i) {
	var step = $("<p></p>")
			.addClass("step")
			.addClass("step-" + this.steppedAlgorithm.steps[i].level)
			.text(this.steppedAlgorithm.steps[i].desc && this.steppedAlgorithm.steps[i].desc() || "");
	this.stepElements[i] = step;
	return step;
};

TextView.prototype.doStep = function(i) {
	this.container.append(this.stepElements[i]);
	this.container.scrollTop(this.container.prop('scrollHeight'));
};

TextView.prototype.undoStep = function(i) {
	this.stepElements[i].remove();
};

TextView.prototype.next = function() {
	var frame = this.keyframes.next(), self = this;
	frame.steps.forEach(function(step) {
		if (frame.add) {
			self.addStep(step.id, step.step);
		}
		self.doStep(step.id);
	});
};

TextView.prototype.last = function() {
	var frame = this.keyframes.last(), self = this;
	frame.steps.forEach(function(step) {
		self.undoStep(step.id);
	});
};

module.exports = TextView;