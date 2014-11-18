'use strict';

var LinkedList = function(val) {
	this.next = null;
	this.value = val;
};

LinkedList.prototype.append = function(val) {
	var node = new LinkedList(val);
	this.next = node;
	return node;
};

module.exports = LinkedList;