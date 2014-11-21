'use strict';

var SteppifyAlgorithm = function(Algorithm, params) {
	this.steps = [];
	this.alg = new Algorithm(params);

	var self = this;

	var steppedFunction = function(f) {
		return function() {
			var r = self[f].apply(self.alg, arguments);
			var description = self.alg.stepDescriptions[f] || {desc: null, level: null};
			self.steps.push({
				name: f, 
				arguments: arguments, 
				returnval: r,
				desc: description.desc, 
				level: description.level
			});
			return r;
		};
	};

	for (var f in Algorithm.prototype) {
		if (f !== 'generate' && Algorithm.prototype.hasOwnProperty(f)) {
			this[f] = this.alg[f];
			this.alg[f] = steppedFunction(f);
		}
	}

	this.alg.generate();
	this.numKeyframes = this.alg.numKeyframes;
};

module.exports = SteppifyAlgorithm;