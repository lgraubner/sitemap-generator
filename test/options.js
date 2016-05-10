/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var port = require('./lib/constants').port;
var localhost = require('./lib/constants').localhost;

/**
 * Options
 */
test('should extend default options with user options', function (t) {
  t.plan(1);

  var options = {
    port: port,
  };
  var generator = new SitemapGenerator(localhost, options);
  t.deepEqual(generator.options, {
    port: port,
    stripQuerystring: true,
    restrictToBasepath: false,
  }, 'objects are equal');
});
