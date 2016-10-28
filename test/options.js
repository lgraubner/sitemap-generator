/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var localhost = require('./lib/constants').localhost;

/**
 * Options
 */
test('should extend default options with user options', function (t) {
  t.plan(1);

  var options = {};
  var generator = new SitemapGenerator(localhost, options);
  t.deepEqual(generator.options, {
    stripQuerystring: true,
    restrictToBasepath: false,
  }, 'objects are equal');
});
