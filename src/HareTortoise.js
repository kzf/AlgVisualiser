'use strict';

var HareTortoise = function(params) {
	this.head = params.linkedlist;

	this.straightLength = -1; // distance to first cycle
	this.cycleLength = -1; // length of cycle

	this.numKeyframes = 0;

	this.stepDescriptions = {
		initialisePointers: {
			desc: "Initalise both pointers to the start of the list",
			level: 0
		},
		comparePointers: {
			desc: "Check whether the pointers are equal",
			level: 0
		},
		hareStep: {
			desc: "Move the hare pointer two steps forward",
			level: 1
		},
		tortoiseStep: {
			desc: "Move the tortoise pointer just one step forward",
			level: 1
		},
		initCycleCount: {
			desc: "Start counting the length of the cycle and move the tortoise one step forward",
			level: 1
		},
		cycleLengthIncrement: {
			desc: "Add one to the length of the cycle",
			level: 1
		},
		initCycleFind: {
			desc: "Move the tortoise the length of the cycle ahead",
			level: 0
		},
		bothOneStep: {
			desc: "Move both pointers one step forward",
			level: 1
		}
	};
};

HareTortoise.prototype.generate = function() {
	this.keyframe();
	this.initialisePointers();
	this.keyframe();
	while (this.comparePointers()) {
		this.tortoiseStep();
		this.hareStep();
		this.keyframe();
	}
	this.keyframe();
	this.initCycleCount();
	this.keyframe();
	while (this.comparePointers()) {
		this.tortoiseStep();
		this.cycleLengthIncrement();
		this.keyframe();
	}
	this.keyframe();
	this.initCycleFind();
	this.keyframe();
	while (this.comparePointers()) {
		this.bothOneStep();
		this.keyframe();
	}
	this.keyframe();
};

HareTortoise.prototype.initialisePointers = function() {
	this.hare = this.head;
	this.tortoise = this.head;
};

HareTortoise.prototype.comparePointers = function() {
	return this.tortoise === this.head || this.hare !== this.tortoise;
};

HareTortoise.prototype.hareStep = function() {
	this.hare = this.hare.next.next;
};

HareTortoise.prototype.tortoiseStep = function() {
	this.tortoise = this.tortoise.next;
};

HareTortoise.prototype.initCycleCount = function() {
	this.tortoise = this.tortoise.next;
	this.cycleLength = 1;
};

HareTortoise.prototype.cycleLengthIncrement = function() {
	this.cycleLength++;
};

HareTortoise.prototype.initCycleFind = function() {
	this.tortoise = this.head;
	this.hare = this.head;
	this.straightLength = 1;
	for (var i = 0; i < this.cycleLength; i++) {
		this.tortoise = this.tortoise.next;
	}
};

HareTortoise.prototype.bothOneStep = function() {
	this.tortoise = this.tortoise.next;
	this.hare = this.hare.next;
	this.straightLength++;
};

HareTortoise.prototype.keyframe = function() {
	this.numKeyframes++;
};

module.exports = HareTortoise;