/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../lib/SitemapGenerator');
var port = require('./lib/constants').port;
var baseUrl = require('./lib/constants').baseUrl;
// test server
var server = require('./lib/server');

// start testserver
test.cb.before(function (t) {
  server.listen(port, baseUrl, function () {
    t.end();
  });
});

require('./events');
require('./fetching');
require('./general');
require('./options');
require('./parsing');
require('./sitemap');

test.cb.after(function (t) {
  // stop test server
  server.close(function () {
    t.end();
  });
});
