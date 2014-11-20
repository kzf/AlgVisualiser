var Steppify = require('./Steppify'),
		TextView = require('./TextView'),
		GraphView = require('./GraphView'),
		ExampleFactory = require('./ExampleFactory'),
		HareTortoise = require('./HareTortoise');

/*********************/

/*var alg = new HareTortoise({linkedlist: cycle});

var textView = new TextView(document.getElementById("view2"), alg);
textView.show();*/

var right_view = document.getElementById("right-view");
var left_view = document.getElementById("left-view");

var AlgorithmRunner = function(Alg, ExFactory, LeftView, RightView) {
	this.exampleFactory = new ExFactory();
	this.Alg = Alg;
	this.LeftView = LeftView;
	this.RightView = RightView;
	this.load(this.exampleFactory.initial);
	this.createExampleForm();
};

AlgorithmRunner.prototype.load = function(input) {
	/* Clear the left and right views */
	while (left_view.firstChild) {
		left_view.removeChild(left_view.firstChild);
	}
	while (right_view.firstChild) {
		right_view.removeChild(right_view.firstChild);
	}

	this.alg = new Steppify(this.Alg, input);

	$(".total-steps").text(this.alg.numKeyframes - 1);

	this.leftView = new this.LeftView(left_view, this.alg);
	this.rightView = new this.RightView(right_view, this.alg);
};

AlgorithmRunner.prototype.createExampleForm = function() {
	var container = $(".example-form").empty();
	this.exampleFactory.parameters.forEach(function(p, i) {
		var div = $("<div class='example-row'></div>");
		var label = $('<label class="example-label" for="param' + i + '"></label>').text(p.desc);
		var input = $('<input class="example-input" type="text" value="' + 
			p.initial + 
			'" name="straightLength" size="4">');
		div.append(label).append(input);
		container.append(div);
	});
};

var algorithm = new AlgorithmRunner(HareTortoise, ExampleFactory, GraphView, TextView);

var currentSteps = $(".current-steps").text(0);

$("#step_back").on("click", function() {
	var currentStep = parseInt(currentSteps.text());
	if (currentStep !== 0) {
		algorithm.rightView.last();
		algorithm.leftView.last();
		currentSteps.text(currentStep - 1);
	}
});
$("#step_forward").on("click", function() {
	var currentStep = parseInt(currentSteps.text());
	if (currentStep !== algorithm.alg.numKeyframes - 1) {
		algorithm.rightView.next();
		algorithm.leftView.next();
		currentSteps.text(parseInt(currentSteps.text()) + 1);
	}
});
var exampleLoader = $(".example-loader");
exampleLoader.addClass("hidden");

$("#example-toggle").on("click", function() {
	exampleLoader.toggleClass("hidden");
});

$(".ui-submit").on("click", function() {
	var args = [];
	$(".example-input").each(function(i, el) {
		args.push(parseInt($(el).val()));
	});
	algorithm.load(algorithm.exampleFactory.build.apply(algorithm.exampleFactory, args));
});

$(".algorithm-list").hide();

$("#back").on("click", function() {
	$(".views").fadeOut();
	$("footer").fadeOut();
	$("#algorithm-list").fadeIn();
	$(".ui-title").text("Algorithm Visualiser");
	$(this).fadeOut();
	$(".algorithm-list").fadeIn();
});