/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../lib/SitemapGenerator');
var baseUrl = require('./lib/constants').baseUrl;

/**
 * Options
 */
test('should extend default options with user options', function (t) {
  t.plan(1);

  var options = {};
  var generator = new SitemapGenerator(baseUrl, options);
  t.deepEqual(generator.options, {
    stripQuerystring: true,
    restrictToBasepath: false,
    maxEntriesPerFile: 50000,
    crawlerMaxDepth: 0,
  }, 'objects are equal');
});
