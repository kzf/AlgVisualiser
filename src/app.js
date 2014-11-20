var LinkedList = require('./LinkedList'),
		Steppify = require('./Steppify'),
		TextView = require('./TextView'),
		GraphView = require('./GraphView'),
		HareTortoise = require('./HareTortoise');

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
};

/*********************/

var cycle = linkedlistWithCycle(7, 5);
/*var alg = new HareTortoise({linkedlist: cycle});

var textView = new TextView(document.getElementById("view2"), alg);
textView.show();*/

var a = new Steppify(HareTortoise, {linkedlist: cycle});
console.log(a);

var textView = new TextView(document.getElementById("right-view"), a);
var graphView = new GraphView(document.getElementById("left-view"), a);
console.log(graphView);

var currentSteps = $(".current-steps").text(0);
console.log("igua");
$(".total-steps").text(a.numKeyframes - 1);

$("#step_back").on("click", function() {
	var currentStep = parseInt(currentSteps.text());
	if (currentStep !== 0) {
		textView.last();
		graphView.last();
		currentSteps.text(currentStep - 1);
	}
});
$("#step_forward").on("click", function() {
	var currentStep = parseInt(currentSteps.text());
	if (currentStep !== a.numKeyframes - 1) {
		textView.next();
		graphView.next();
		currentSteps.text(parseInt(currentSteps.text()) + 1);
	}
});