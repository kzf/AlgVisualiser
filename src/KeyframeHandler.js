'use strict';

var KeyframeHandler = function(steps) {
	this.steps = steps;
	this.currentStep = 0;
	this.currentKeyframe = 0;
	this.generatedKeyframes = 0;
};

KeyframeHandler.prototype.next = function() {
	var ret = { steps: [] };
	if (this.generatedKeyframes < this.currentKeyframes) {
		ret.add = false;
	} else {
		ret.add = true;
		this.generatedKeyframes++;
	}
	while (this.steps[++this.currentStep].name !== 'keyframe') {
		ret.steps.push({id: this.currentStep, step: this.steps[this.currentStep]});
	}
	ret.steps.push({id: this.currentStep, step: this.steps[this.currentStep]});
	this.currentKeyframe++;
	return ret;
};

KeyframeHandler.prototype.last = function() {
	var ret = { steps: [] };
	ret.steps.push({id: this.currentStep, step: this.steps[this.currentStep]});
	while (this.steps[--this.currentStep].name !== 'keyframe') {
		ret.steps.push({id: this.currentStep, step: this.steps[this.currentStep]});
	}
	this.currentKeyframe--;
	return ret;
};

module.exports = KeyframeHandler;