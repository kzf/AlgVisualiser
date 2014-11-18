var LinkedList = function(val) {
	this.next = null;
	this.value = val;
}

LinkedList.prototype.append = function(val) {
	var node = new LinkedList(val);
	this.next = node;
	return node;
}

var linkedlistWithCycle = function(a, b) {
	var i, node = new LinkedList(0);
	var first = node;
	for (i = 1; i < a; i++) {
		node = node.append(i);
	}
	var cycleStart = node;
	for (i = 1; i < b; i++) {
		node = node.append(a+i-1);
	}
	node.next = cycleStart;
	return first;
}

/********************/

var SteppifyAlgorithm = function(Algorithm, params) {
	this.steps = [];
	this.alg = new Algorithm(params);

	var self = this;

	var steppedFunction = function(f) {
		return function() {
			var r = self[f].apply(self.alg, arguments);
			self.steps.push({name: f, arguments: arguments});
			return r;
		}
	}

	for (var f in Algorithm.prototype) {
		if (f != 'generate' && Algorithm.prototype.hasOwnProperty(f)) {
			this[f] = this.alg[f];
			this.alg[f] = steppedFunction(f);
		}
	}

	this.alg.generate();
}

/********************/

var HareTortoise = function(params) {
	console.log(params);
	this.head = params.linkedlist;

	this.straightLength = -1; // distance to first cycle
	this.cycleLength = -1; // length of cycle

	this.steps = [];
}

HareTortoise.prototype.generate = function() {
	this.initialisePointers();
	console.log(this.comparePointers());
	while (this.comparePointers()) {
		this.tortoiseStep();
		this.hareStep();
		console.log(this.tortoise.value);
	}
}

HareTortoise.prototype.initialisePointers = function() {
	this.hare = this.head;
	this.tortoise = this.head;
	this.steps.push({name: 'initialisePointers'});
}

HareTortoise.prototype.comparePointers = function() {
	console.log(this.tortoise === this.head || this.hare !== this.tortoise);
	this.steps.push({name: 'comparePointers'});
	return this.tortoise === this.head || this.hare !== this.tortoise;
}

HareTortoise.prototype.hareStep = function() {
	this.hare = this.hare.next.next;
	this.steps.push({name: 'hareStep'});
}

HareTortoise.prototype.tortoiseStep = function() {
	console.log(this, this.tortoise);
	this.tortoise = this.tortoise.next;
	this.steps.push({name: 'tortoiseStep'});
}

/*********************/

var TextView = function(container, steppedAlgorithm) {
	this.container = container;
	this.steppedAlgorithm = steppedAlgorithm;
}

TextView.prototype.show = function() {
	var container = this.container;
	this.steppedAlgorithm.steps.forEach(function(s) {
		var step = document.createElement("p");
		step.className = "step ";
		step.innerHTML = s.name;
		container.appendChild(step);
	});
}

/*********************/

var cycle = linkedlistWithCycle(3, 5);
/*var alg = new HareTortoise({linkedlist: cycle});

var textView = new TextView(document.getElementById("view2"), alg);
textView.show();*/

var a = new SteppifyAlgorithm(HareTortoise, {linkedlist: cycle});
console.log(a.steps);

var textView = new TextView(document.getElementById("view2"), a);
textView.show();