'use strict';

var HareTortoise = function(params) {
	console.log(params);
	this.head = params.linkedlist;

	this.straightLength = -1; // distance to first cycle
	this.cycleLength = -1; // length of cycle

	this.steps = [];
};

HareTortoise.prototype.generate = function() {
	this.initialisePointers();
	console.log(this.comparePointers());
	while (this.comparePointers()) {
		this.tortoiseStep();
		this.hareStep();
		console.log(this.tortoise.value);
	}
};

HareTortoise.prototype.initialisePointers = function() {
	this.hare = this.head;
	this.tortoise = this.head;
	this.steps.push({name: 'initialisePointers'});
};

HareTortoise.prototype.comparePointers = function() {
	console.log(this.tortoise === this.head || this.hare !== this.tortoise);
	this.steps.push({name: 'comparePointers'});
	return this.tortoise === this.head || this.hare !== this.tortoise;
};

HareTortoise.prototype.hareStep = function() {
	this.hare = this.hare.next.next;
	this.steps.push({name: 'hareStep'});
};

HareTortoise.prototype.tortoiseStep = function() {
	console.log(this, this.tortoise);
	this.tortoise = this.tortoise.next;
	this.steps.push({name: 'tortoiseStep'});
};

module.exports = HareTortoise;