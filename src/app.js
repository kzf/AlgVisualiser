var Steppify = require('./Steppify'),
		TextView = require('./TextView'),
		HareTortoise = require('./HareTortoise');

/*********************/

/*var alg = new HareTortoise({linkedlist: cycle});

var textView = new TextView(document.getElementById("view2"), alg);
textView.show();*/

var algorithms = [
	{
		desc: "Hare and Tortoise Algorithm",
		alg: HareTortoise.Alg,
		examples: HareTortoise.Examples,
		leftView: HareTortoise.GraphView,
		rightView: TextView
	}, {
		desc: "Breadth First Search",
		alg: HareTortoise.Alg,
		examples: HareTortoise.Examples,
		leftView: HareTortoise.GraphView,
		rightView: TextView
	}, {
		desc: "Depth First Search",
		alg: HareTortoise.Alg,
		examples: HareTortoise.Examples,
		leftView: HareTortoise.GraphView,
		rightView: TextView
	}
];

/*==============
	Algorithm Runner
	Functionality for intialising a new algorithm and reloading with different
	inputs
	==============*/
var AlgorithmRunner = function(Alg, ExFactory, LeftView, RightView, 
															left_view, right_view, example_form) {
	this.left_view = left_view;
	this.right_view = right_view;
	this.example_form = example_form;
	this.exampleFactory = new ExFactory();
	this.Alg = Alg;
	this.LeftView = LeftView;
	this.RightView = RightView;
	this.load(this.exampleFactory.initial);
	this.createExampleForm();
};

AlgorithmRunner.prototype.load = function(input) {
	/* Clear the left and right views */
	while (this.left_view.firstChild) {
		this.left_view.removeChild(this.left_view.firstChild);
	}
	while (this.right_view.firstChild) {
		this.right_view.removeChild(this.right_view.firstChild);
	}

	this.alg = new Steppify(this.Alg, input);

	$(".total-steps").text(this.alg.numKeyframes - 1);

	this.leftView = new this.LeftView(this.left_view, this.alg);
	console.log(this.leftView);
	this.rightView = new this.RightView(this.right_view, this.alg);
};

AlgorithmRunner.prototype.createExampleForm = function() {
	var container = this.example_form.empty();
	this.exampleFactory.parameters.forEach(function(p, i) {
		var div = $("<div class='example-row'></div>");
		var label = $('<label class="example-label" for="param' + i + '"></label>').text(p.desc);
		var input = $('<input class="example-input" type="text" value="' + 
			p.initial + 
			'" name="param' + i + '" size="4">');
		div.append(label).append(input);
		container.append(div);
	});
};

/*==============
	App
	Main controller for the app
	==============*/
var App = function() {
	this.right_view = document.getElementById("right-view");
	this.left_view = document.getElementById("left-view");

	this.example_loader = $(".example-loader");
	this.example_form = $(".example-form");

	this.currentSteps = $(".current-steps");
	this.totalSteps = $(".total-steps");

	this.algorithm_header = $(".ui-title");
	this.algorithm_list = $(".algorithm-list");
	this.algorithm_display = $(".views").hide().add(
															$(".bottom-action-bar").hide()
														).add(
															$("#back").hide()
														);

	this.algorithm_ul = $(".algorithm-list ul");

	this.displayAlgorithms();
	this.registerEventHandlers();
};

App.prototype.loadAlgorithm = function(i) {
	this.algorithm = new AlgorithmRunner(
			algorithms[i].alg,
			algorithms[i].examples,
			algorithms[i].leftView,
			algorithms[i].rightView,
			this.left_view,
			this.right_view,
			this.example_form
		);

	// Step counts
	this.currentSteps.text(0);
	this.totalSteps.text(this.algorithm.alg.numKeyframes);

	// Header
	this.algorithm_header.text(algorithms[i].desc);

	// Show the algorithm view
	this.algorithm_list.fadeOut();
	this.algorithm_display.fadeIn();
};

App.prototype.displayAlgorithms = function() {
	var i, li, self = this;
	var loadAlgorithm = function(i) {
		return function() { self.loadAlgorithm(i); };
	};
	for (i = 0; i < algorithms.length; i++) {
		li = $("<li></li>").text(algorithms[i].desc);
		li.on("click", loadAlgorithm(i));
		this.algorithm_ul.append(li);
	}
};

App.prototype.registerEventHandlers = function() {
	var self = this;

	// Last step button
	$("#step_back").on("click", function() {
		var currentStep = parseInt(self.currentSteps.text());
		if (currentStep !== 0) {
			self.algorithm.rightView.last();
			self.algorithm.leftView.last();
			self.currentSteps.text(currentStep - 1);
		}
	});

	// Next step button
	$("#step_forward").on("click", function() {
		var currentStep = parseInt(self.currentSteps.text());
		if (currentStep !== self.algorithm.alg.numKeyframes - 1) {
			self.algorithm.rightView.next();
			self.algorithm.leftView.next();
			self.currentSteps.text(parseInt(self.currentSteps.text()) + 1);
		}
	});

	// Button to show/hide the example input box
	$("#example-toggle").on("click", function() {
		self.example_loader.toggleClass("hidden");
	});

	// Button to load an example
	$(".ui-submit").on("click", function() {
		var args = [];
		$(".example-input").each(function(i, el) {
			args.push(parseInt($(el).val()));
		});
		self.algorithm.load(
			self.algorithm.exampleFactory.build.apply(self.algorithm.exampleFactory, args)
		);
	});

	$("#back").on("click", function() {
		self.algorithm_list.fadeIn();
		self.algorithm_display.fadeOut();
		self.algorithm_header.text("Algorithm Visualiser");
	});

};

var app = new App();
console.log(app);