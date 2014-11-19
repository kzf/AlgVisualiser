'use strict';

var TextView = function(container, steppedAlgorithm) {
	this.container = container;
	this.steppedAlgorithm = steppedAlgorithm;
	this.maxSteps = this.steppedAlgorithm.steps.length;
	this.currentStep = 0;
	this.currentKeyframe = 0;
	this.generatedKeyframes = 0;
	this.stepElements = [];
};

TextView.prototype.addKeyframe = function() {
	var i = this.currentStep;
	while (this.steppedAlgorithm.steps[++i].name !== 'keyframe') {
		this.addStep(i);
	}
	this.generatedKeyframes++;
};

TextView.prototype.addStep = function(i) {
	var step = document.createElement("p");
	step.className = "step ";
	step.innerHTML = this.steppedAlgorithm.steps[i].name;
	this.stepElements[i] = step;
	return step;
};

TextView.prototype.doStep = function(i) {
	this.container.appendChild(this.stepElements[i]);
};

TextView.prototype.undoStep = function(i) {
	this.container.removeChild(this.stepElements[i]);
};

TextView.prototype.next = function() {
	if (this.currentSteps >= this.maxSteps) {
		throw "Asked for next step when algorithm has terminated";
	}
	if (this.currentKeyframe === this.generatedKeyframes) {
		this.addKeyframe();
	}
	while (this.steppedAlgorithm.steps[++this.currentStep].name !== 'keyframe') {
		this.doStep(this.currentStep);
	}
	this.currentKeyframe++;
};

TextView.prototype.last = function() {
	if (this.currentStep === 0) {
		throw "Asked for last step when algorithm has not started";
	}
	while (this.steppedAlgorithm.steps[--this.currentStep].name !== 'keyframe') {
		this.undoStep(this.currentStep);
	}
};

module.exports = TextView;