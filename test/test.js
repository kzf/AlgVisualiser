(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('LinkedList', {
    setup: function() { }
  });

  test('creates empty list', function() {
    expect(2);
    var a = new LinkedList(17);
    strictEqual(a.val, 17, 'should start with the initialised value');
    strictEqual(a.next, null, 'should create a singleton linked list');
  });

}(jQuery));
